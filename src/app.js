import express from 'express';
import 'dotenv/config'
import { connectDB } from './config/database.js'
import eventsRouter from './routes/events.router.js'

const app = express();

app.use(express.json())

connectDB();

app.use('/api/events', eventsRouter)
app.get('/health', (req, res) => {
  res.json({ status: "ok", message: "Servidor activo" });
});

app.get('/events', (req, res) => {
  res.json({ success: "ok", payload: [] });
});




app.listen(8080, () => {

    console.log( "Servidor anclado en el puerto 8080")
    
})