import path from 'path';
import express from 'express';
import dotenv from 'dotenv';
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import cookieParser from 'cookie-parser';
dotenv.config();
import connectDB from './config/db.js';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';
import productRoutes from './routes/productRoutes.js';
import userRoutes from './routes/userRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';

const port = process.env.PORT || 5000;


connectDB();

const app = express();

const options = {
  swaggerDefinition: {

    openapi: '3.0.0',
    info: {
      title: `Documentación API's HOUSESTAGE `,
      version: '1.0.0',
      description: 'Endpoints de consumo con sus diferentes métodos para productos, usuarios y ordenes de compra, información de tallada de función y posibles códigos de respuesta asi como variables y tipos de datos',
    },
    servers: [
      {
        url: 'http://localhost:5000',
        description: 'Servidor local',
      },
    ]
  },
  apis: ["backend/controllers/*.js", "backend/models/*,js"],
};

const specs = swaggerJsdoc(options);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());


app.use('/api/products', productRoutes);
app.use('/api/users', userRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/upload', uploadRoutes);
app.get('/api/config/paypal', (req, res) =>
  res.send({ clientId: process.env.PAYPAL_CLIENT_ID })

);

const __dirname = path.resolve();
app.use('/uploads', express.static(path.join(__dirname, '/uploads')));


if (process.env.NODE_ENV === 'development') {
  app.use(express.static(path.join(__dirname, '/frontend/build')));
  app.get('*', (req, res) =>
    res.sendFile(path.resolve(__dirname, 'frontend', 'build', 'index.html'))
  );
} else {
  app.get('/', (req, res) => {
    res.send('Hello World! API corriendo correctamente!');
  });
}

app.use(notFound);
app.use(errorHandler);

app.listen(port, () => console.log(`Servidor en ejecución en el puerto ${port}`));