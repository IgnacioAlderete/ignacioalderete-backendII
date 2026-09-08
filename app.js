import express from 'express';
import passport from "passport";

import "./config/passport.config.js";
import connectDB from "./config/database.js";
import 'dotenv/config';
import cookieParser from 'cookie-parser';

import { connectDB } from './src/config/database.js';
import sessionRouter from "./src/routes/sessions.router.js";
import eventsRouter from "./src/routes/events.router.js";
import ticketRouter from "./src/routes/tickets.router.js";


const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use(
  passport.initialize()
);

connectDB();

app.get('/health', (req, res) => {
    res.json({
        status: "ok",
        message: "Servidor activo"
    });
});

app.get('/events', (req, res) => {
    res.json({
        success: "ok",
        payload: []
    });
});

app.use("/api/sessions", sessionRouter);
app.use("/api/events", eventsRouter);
app.use ("/api/tickets", ticketsRouter)


app.use(cookieParser())

app.use((req, res) => {
  res.status(404).json({
    status: "error",
    message: `Ruta no encontrada: ${req.method} ${req.originalUrl}`
  });
});



const PORT = process.env.PORT || 8080;

app.use((err, req, res, next) => {
  console.error(err);

  const status = err.status || 500;

  res.status(status).json({
    status: "error",
    message: err.message || "Error interno del servidor"
  });
});

const startServer = async () => {
  try {
    await connectDB();

    app.listen(PORT, () => {
      console.log(`Servidor escuchando en http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("No se pudo iniciar la aplicación:", error.message);
    process.exit(1);
  }
};

startServer();