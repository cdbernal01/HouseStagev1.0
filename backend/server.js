import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
dotenv.config();
import connectDB from './config/db.js';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';
import productRoutes from './routes/productRoutes.js';
import userRoutes from './routes/userRoutes.js';
import orderRoutes from './routes/orderRoutes.js';

const port = process.env.PORT || 5000;

connectDB(); // Conexión Base Datos MongoAtlas

const app = express();

//Body request Parser middleware para login

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//Cookie Parser middleware
app.use(cookieParser());

app.get('/', (req, res) => {
  res.send('Hello World! API corriendo correctamente!');
});

app.use(`/api/products`, productRoutes);
app.use(`/api/users`, userRoutes);
app.use(`/api/orders`, orderRoutes);

app.get('/api/config/paypal', (req, res) =>
  res.send({ clientId: process.env.PAYPAL_CLIENT_ID })
);

app.use(notFound);
app.use(errorHandler);

app.listen(port, () => console.log(`Server running on the port ${port}`));
