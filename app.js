import express from 'express';
import 'dotenv/config';
import cookieParser from 'cookie-parser';

import { connectDB } from './src/config/database.js';
import sessionRouter from "./src/routes/sessions.router.js";

const app = express();

app.use(express.json());

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

app.use(cookieParser())


app.use(
  passport.initialize()
);

const PORT = process.env.PORT || 8080;


app.listen(8080, () => {
    console.log("Servidor anclado en el puerto 8080");
});