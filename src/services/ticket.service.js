import { Ticket }from "../models/ticket.model.js";
import {Event} from "../models/event.model.js";

export const createTicket = async (eventId, userId, quantity) => {

   
    if (!Number.isInteger(quantity) || quantity <= 0) {
        throw new Error("La cantidad debe ser un número entero mayor a 0");
    }

    const event = await Event.findById(eventId);

    if (!event) {
        throw new Error("El evento no existe");
    }

    if (event.status !== "published") {
        throw new Error("El evento no está publicado");
    }

    // Buscar tickets activos del evento
    const activeTickets = await Ticket.find({
        event: eventId,
        status: "active"
    });

    //  Calcular cupos ocupados
    const occupied = activeTickets.reduce(
        (total, ticket) => total + ticket.quantity,
        0
    );

    // Calcular cupos disponibles
    const available = event.capacity - occupied;

    if (available < quantity) {
        throw new Error("No hay suficientes cupos disponibles");
    }

    // Verificar si el usuario ya tiene un ticket activo
    const existingTicket = await Ticket.findOne({
        user: userId,
        event: eventId,
        status: "active"
    });

    if (existingTicket) {
        throw new Error(
            "El usuario ya tiene un ticket activo para este evento"
        );
    }

  
    const ticket = await Ticket.create({
        user: userId,
        event: eventId,
        quantity,
        status: "active"
    });

    return ticket;
};


export const cancelTicket = async (ticketId, userId, userRole) => {

  
    const ticket = await Ticket.findById(ticketId);

    if (!ticket) {
        throw new Error("El ticket no existe");
    }

    
    if (ticket.status === "cancelled") {
        throw new Error("El ticket ya está cancelado");
    }

    // Verificar propietario
    const isOwner =
        ticket.user.toString() === userId.toString();

    const isAdmin = userRole === "admin";

    if (!isOwner && !isAdmin) {
        throw new Error(
            "No tienes permisos para cancelar este ticket"
        );
    }

    ticket.status = "cancelled";
    ticket.cancelledAt = new Date();

    await ticket.save();

    return ticket;
};

export const getMyTickets = async (userId) => {

    const tickets = await Ticket.find({
        user: userId
    }).populate(
        "event",
        "title date location"
    );

    return tickets;
};

const event = await Event.findById(eventId);

if (!event) {
    throw new Error("El evento no existe");
}

const isAdmin = userRole === "admin";

const isOrganizer =
    userRole === "organizer" &&
    event.organizer.toString() === userId.toString();

if (!isAdmin && !isOrganizer) {
    throw new Error(
        "No tienes permisos para consultar los tickets de este evento"
    );
}