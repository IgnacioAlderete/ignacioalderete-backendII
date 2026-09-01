import SessionService from "../services/session.services.js";

const sessionService = new SessionService();

export const register = async (req, res) => {

    try {

        const user = await sessionService.register(req.body);

        res.status(201).json({
            status: "success",
            message: "Usuario registrado correctamente",
            user
        });

    } catch (error) {

        res.status(400).json({
            status: "error",
            message: error.message
        });

    }
};