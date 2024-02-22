import asyncHandler from '../middleware/asyncHandler.js';
import Order from '../models/orderModel.js';
import Product from '../models/productModel.js';
//import { calcPrices } from '../utils/calcPrices.js';
//import { verifyPayPalPayment, checkIfNewTransaction } from '../utils/paypal.js';

// @desc    Create new order
// @route   POST /api/orders
// @access  Private

/**
 * @swagger
 * /api/orders:
 *   post:
 *     tags:
 *       - Órdenes
 *     summary: Crear una nueva orden
 *     description: Crea una nueva orden con los productos especificados y la información de envío y pago proporcionada.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               orderItems:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       description: ID del producto.
 *                     quantity:
 *                       type: number
 *                       description: Cantidad del producto.
 *                 description: Lista de productos en la orden.
 *               shippingAddress:
 *                 type: object
 *                 properties:
 *                   address:
 *                     type: string
 *                     description: Dirección de envío.
 *                   city:
 *                     type: string
 *                     description: Ciudad de envío.
 *                   country:
 *                     type: string
 *                     description: País de envío.
 *               paymentMethod:
 *                 type: string
 *                 description: Método de pago seleccionado.
 *               itemsPrice:
 *                 type: number
 *                 description: Precio total de los productos.
 *               taxPrice:
 *                 type: number
 *                 description: Precio total del impuesto.
 *               shippingPrice:
 *                 type: number
 *                 description: Precio total del envío.
 *               totalPrice:
 *                 type: number
 *                 description: Precio total de la orden.
 *             required:
 *               - orderItems
 *               - shippingAddress
 *               - paymentMethod
 *               - itemsPrice
 *               - taxPrice
 *               - shippingPrice
 *               - totalPrice
 *     responses:
 *       '200':
 *         description: Orden creada exitosamente.
 *       '400':
 *         description: No se especificaron productos en la orden.
 *       '500':
 *         description: Error interno del servidor.
 */
const addOrderItems = asyncHandler(async (req, res) => {
  const {
    orderItems,
    shippingAddress,
    paymentMethod,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
  } = req.body;

  if (orderItems && orderItems.length === 0) {
    res.status(400);
    throw new Error('No order items');
  } else {
    const order = new Order({
      orderItems: orderItems.map((x) => ({
        ...x,
        product: x._id,
        _id: undefined,
      })),
      user: req.user._id,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
    });

    const createOrder = await order.save();

    res.status(200).json(createOrder);
  }
});

// @desc    Get logged in user orders
// @route   GET /api/orders/myorders
// @access  Private

/**
 * @swagger
 * /api/orders/myorders:
 *   get:
 *     tags:
 *       - Órdenes
 *     summary: Obtener mis órdenes
 *     description: Obtiene todas las órdenes del usuario autenticado.
 *     security:
 *       - jwt: []
 *     responses:
 *       '200':
 *         description: Lista de órdenes del usuario.
 *       '401':
 *         description: No autorizado, se necesita un token de acceso válido.
 *       '500':
 *         description: Error interno del servidor.
 */
const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id });
  res.status(200).json(orders);
});

/**
 * @swagger
 * /api/orders/{id}:
 *   get:
 *     tags:
 *       - Órdenes
 *     summary: Obtener una orden por su ID
 *     description: Obtiene los detalles de una orden específica por su ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID de la orden
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Detalles de la orden solicitada.
 *       '404':
 *         description: La orden no fue encontrada.
 */

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private

/**
 * @swagger
 * /api/orders/{id}:
 *   get:
 *     tags:
 *       - Órdenes
 *     summary: Obtener una orden por su ID
 *     description: Obtiene los detalles de una orden específica por su ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID de la orden
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Detalles de la orden solicitada.
 *       '404':
 *         description: La orden no fue encontrada.
 */

const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id).populate(
    'user',
    'name email'
  );

  if (order) {
    res.json(order);
  } else {
    res.status(404);
    throw new Error('Order not found');
  }
});

// @desc    Update order to paid
// @route   PUT /api/orders/:id/pay
// @access  Private

/**
 * @swagger
 * /api/orders/{id}/pay:
 *   put:
 *     tags:
 *       - Órdenes
 *     summary: Actualizar orden como Pagada
 *     description: Actualiza el estado de una orden a pagada y registra la información de pago.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID de la orden
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: string
 *                 description: ID de la transacción de pago.
 *               status:
 *                 type: string
 *                 description: Estado de la transacción de pago.
 *               update_time:
 *                 type: string
 *                 description: Fecha de la última actualización de la transacción.
 *               payer:
 *                 type: object
 *                 properties:
 *                   email_address:
 *                     type: string
 *                     format: email
 *                     description: Correo electrónico del pagador.
 *             required:
 *               - id
 *               - status
 *               - update_time
 *               - payer
 *     responses:
 *       '200':
 *         description: Orden actualizada como pagada con éxito.
 *       '404':
 *         description: La orden no fue encontrada.
 */

const updateOrderToPaid = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (order) {
    order.isPaid = true;
    order.paidAt = Date.now();
    order.paymentResult = {
      id: req.body.id,
      status: req.body.status,
      update_time: req.body.update_time,
      email_address: req.body.payer.email_address,
    };

    const updatedOrder = await order.save();

    res.json(updatedOrder);
  } else {
    res.status(404);
    throw new Error('Order not found');
  }
});

// @desc    Update order to delivered
// @route   GET /api/orders/:id/deliver
// @access  Private/Admin

/**
 * @swagger
 * /api/orders/{id}/deliver:
 *   put:
 *     tags:
 *       - Órdenes
 *     summary: Actualizar orden como Entregada
 *     description: Actualiza el estado de una orden a entregada, registrando la fecha de entrega.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID de la orden
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Orden actualizada como entregada con éxito.
 *       '404':
 *         description: La orden no fue encontrada.
 */

const updateOrderToDelivered = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (order) {
    order.isDelivered = true;
    order.deliveredAt = Date.now();

    const updatedOrder = await order.save();

    res.json(updatedOrder);
  } else {
    res.status(404);
    throw new Error('Order not found');
  }
});

// @desc    Get all orders
// @route   GET /api/orders
// @access  Private/Admin

/**
 * @swagger
 * /api/orders:
 *   get:
 *     tags:
 *       - Órdenes
 *     summary: Obtener todas las órdenes
 *     description: Obtiene todas las órdenes del sistema.
 *     responses:
 *       '200':
 *         description: Lista de todas las órdenes.
 */
const getOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({}).populate('user', 'id name');
  res.json(orders);
});

export {
  addOrderItems,
  getMyOrders,
  getOrderById,
  updateOrderToPaid,
  updateOrderToDelivered,
  getOrders,
};
