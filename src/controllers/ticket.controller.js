export const createTicket = async(req,res) =>{
    try{

        const {eventId, quantity} = req.body

        const event = await Event.findById(eventId)

        if(!event){
            return res.status(404).json({
                status: "error",
                message: "Evento no encontrado"
            })
        }

        if(event.status !== "published"){
            return res.status(404).json({
                status: "error",
                message: "Evento no publicado"
            })
        }

        if(event.date <= new Date()) {
            
        }

        const existingTicket = await TicketModel.findOne({
            user: req.user._id,
            event: event._id,
            status: "active"
        })

        if(existingTicket){
           return res.status(404).json({
                status: "error",
                message: "Ya tienes un ticket para este evento"
            })
        }

        const result = await TicketModel.aggregate([
            {
                $match: {event: event._id, status: "active"}
            },

            {
                $group: {_id: "$event", totalReserved: {$sum: "$quantity"}}
            }
        ])

        const reserved = result[0]?.totalReserved || 0

        const available = event.capacity - reserved

        if(available < quantity){
            return res.status(400).json({
                status:"error",
                message: "No hay suficientes entradas disponibles"
            })
        }

        const ticket = await TicketModel.create({
            user: req.user._id,
            event: event._id,
            quantity: quantity
        })

        res.status(201).json({
            status: "success",
            data: ticket
        })

    }catch (error){
        res.status(500).json({
            message: error.message
        })
    }
}

export const getEventTickets = async (req, res) => {
  try {
    const tickets = await ticketService.getEventTickets(
      req.params.eid,
      req.user.id,
      req.user.role
    );

    res.json({
      status: "success",
      payload: tickets
    });

  } catch (error) {
    res.status(403).json({
      status: "error",
      message: error.message
    });
  }
};

export const cancelTicket = async (req, res) => {
  try {
    const ticket = await ticketService.cancelTicket(
      req.params.tid,
      req.user.id,
      req.user.role
    );

    res.json({
      status: "success",
      payload: ticket
    });

  } catch (error) {
    res.status(400).json({
      status: "error",
      message: error.message
    });
  }
};