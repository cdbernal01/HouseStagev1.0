/**
 * @swagger
 * components:
 *   schemas:
 *     Review:
 *       type: object
 *       required:
 *         - name
 *         - rating
 *         - comment
 *       properties:
 *         name:
 *           type: string
 *           description: Nombre del usuario que escribió la revisión.
 *         rating:
 *           type: number
 *           format: float
 *           description: Clasificación asignada al producto por el usuario.
 *         comment:
 *           type: string
 *           description: Comentario del usuario sobre el producto.
 *         user:
 *           type: string
 *           description: ID del usuario que escribió la revisión.
 *
 *     Product:
 *       type: object
 *       required:
 *         - name
 *         - image
 *         - brand
 *         - category
 *         - description
 *       properties:
 *         user:
 *           type: string
 *           description: ID del usuario que creó el producto.
 *         name:
 *           type: string
 *           description: Nombre del producto.
 *         image:
 *           type: string
 *           description: URL de la imagen del producto.
 *         brand:
 *           type: string
 *           description: Marca del producto.
 *         category:
 *           type: string
 *           description: Categoría del producto.
 *         description:
 *           type: string
 *           description: Descripción del producto.
 *         reviews:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Review'
 *           description: Lista de revisiones del producto.
 *         rating:
 *           type: number
 *           format: float
 *           description: Clasificación promedio del producto.
 *         numReviews:
 *           type: number
 *           description: Número total de revisiones del producto.
 *         price:
 *           type: number
 *           format: float
 *           description: Precio del producto.
 *         countInStock:
 *           type: number
 *           description: Cantidad disponible en stock del producto.
 */

import mongoose from 'mongoose';

const reviewSchema = mongoose.Schema(
  {
    name: { type: String, required: true },
    rating: { type: Number, required: true },
    comment: { type: String, required: true },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
  },
  {
    timestamps: true,
  }
);

const productSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    name: {
      type: String,
      required: true,
    },
    images: [{
      type: String,
      required: true,
    }],
    brand: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    reviews: [reviewSchema],
    rating: {
      type: Number,
      required: true,
      default: 0,
    },
    numReviews: {
      type: Number,
      required: true,
      default: 0,
    },
    price: {
      type: Number,
      required: true,
      default: 0,
    },
    countInStock: {
      type: Number,
      required: true,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

const Product = mongoose.model('Product', productSchema);

export default Product;
