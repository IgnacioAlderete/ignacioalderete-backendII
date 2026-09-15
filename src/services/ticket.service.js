import mongoose from "mongoose";
import { TicketRepository } from "../repositories/tickets.repository.js";
import { EventRepository } from "../repositories/event.repository.js";

const businessError = (message, status = 400) =>
  Object.assign(new Error(message), { status });

export class TicketService {

  constructor() {
    this.ticketRepository = new TicketRepository();
    this.eventRepository = new EventRepository();
  }

  validateObjectId(id, message = "ID inválido") {
    if (!mongoose.isValidObjectId(id)) {
      throw businessError(message, 400);
    }
  }

  // CREAR TICKET
  async createTicket(eventId, userId, quantity) {

    this.validateObjectId(eventId, "ID de evento inválido");
    this.validateObjectId(userId, "ID de usuario inválido");

    // Validar cantidad
    if (!Number.isInteger(quantity) || quantity <= 0) {
      throw businessError(
        "La cantidad debe ser un número entero mayor a 0"
      );
    }

    // Buscar evento mediante Repository
    const event = await this.eventRepository.findById(eventId);

    if (!event) {
      throw businessError("El evento no existe", 404);
    }

    // Validar estado del evento
    if (event.status !== "published") {
      throw businessError("El evento no está publicado");
    }

    // Buscar tickets activos del evento
    const activeTickets = await this.ticketRepository.find({
      event: eventId,
      status: "active"
    });

    // Calcular cupos ocupados
    const occupied = activeTickets.reduce(
      (total, ticket) => total + ticket.quantity,
      0
    );

    // Calcular cupos disponibles
    const available = event.capacity - occupied;

    if (available < quantity) {
      throw businessError("No hay suficientes cupos disponibles", 409);
    }

    // Verificar si el usuario ya tiene un ticket activo
    const existingTicket = await this.ticketRepository.findOne({
      user: userId,
      event: eventId,
      status: "active"
    });

    if (existingTicket) {
      throw businessError(
        "El usuario ya tiene un ticket activo para este evento",
        409
      );
    }

    // Crear ticket
    const ticket = await this.ticketRepository.create({
      user: userId,
      event: eventId,
      quantity,
      status: "active"
    });

    return ticket;
  }


  // CANCELAR TICKET
  async cancelTicket(ticketId, userId, userRole) {

    this.validateObjectId(ticketId, "ID de ticket inválido");
    this.validateObjectId(userId, "ID de usuario inválido");

    const ticket = await this.ticketRepository.findById(ticketId);

    if (!ticket) {
      throw businessError("El ticket no existe", 404);
    }

    // Verificar si ya está cancelado
    if (ticket.status === "cancelled") {
      throw businessError("El ticket ya está cancelado");
    }

    // Verificar propietario
    const isOwner =
      ticket.user.toString() === userId.toString();

    const isAdmin = userRole === "admin";

    if (!isOwner && !isAdmin) {
      throw businessError(
        "No tienes permisos para cancelar este ticket",
        403
      );
    }

    // Cancelar ticket
    const updatedTicket = await this.ticketRepository.updateById(
      ticketId,
      {
        status: "cancelled",
        cancelledAt: new Date()
      }
    );

    return updatedTicket;
  }


  // OBTENER MIS TICKETS
  async getMyTickets(userId) {

    this.validateObjectId(userId, "ID de usuario inválido");

    const tickets = await this.ticketRepository.findByUser(userId);

    return tickets;
  }


  // OBTENER TICKETS DE UN EVENTO
  async getEventTickets(eventId, userId, userRole) {

    this.validateObjectId(eventId, "ID de evento inválido");
    this.validateObjectId(userId, "ID de usuario inválido");

    // Buscar evento
    const event = await this.eventRepository.findById(eventId);

    if (!event) {
      throw businessError("El evento no existe", 404);
    }

    // Verificar permisos
    const isAdmin = userRole === "admin";

    const isOrganizer =
      userRole === "organizer" &&
      event.organizer.toString() === userId.toString();

    if (!isAdmin && !isOrganizer) {
      throw businessError(
        "No tienes permisos para consultar los tickets de este evento",
        403
      );
    }

    // Obtener tickets
    const tickets =
      await this.ticketRepository.findByEvent(eventId);

    return tickets;
  }
}