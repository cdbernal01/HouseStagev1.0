import asyncHandler from '../middleware/asyncHandler.js';
import Product from '../models/productModel.js';

// @Description  Busca los productos
// @router       GET /api/products
// @access       Public

/**
 * @swagger
 * /api/products:
 *   get:
 *     tags:
 *       - Productos
 *     summary: Obtener productos
 *     description: Obtiene todos los productos disponibles.
 *     responses:
 *       '200':
 *         description: Productos obtenidos exitosamente.
 *       '500':
 *         description: Error del servidor.
 */
const getProducts = asyncHandler(async (req, res) => {
  const pageSize = 8;
  const page = Number(req.query.pageNumber) || 1;

  const keyword = req.query.keyword
    ? { name: { $regex: req.query.keyword, $options: 'i' } }
    : {};

  const count = await Product.countDocuments({...keyword});

  const products = await Product.find({...keyword})
    .limit(pageSize)
    .skip(pageSize * (page - 1));
  res.json({ products, page, pages: Math.ceil(count / pageSize) });
});

// @Description  Busca los productos
// @router       GET /api/products/:id
// @access       Public

/**
 * @swagger
 * /api/products/{id}:
 *   get:
 *     tags:
 *       - Productos
 *     summary: Obtener producto por ID
 *     description: Obtiene un producto específico por su ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del producto a obtener.
 *     responses:
 *       '200':
 *         description: Producto obtenido exitosamente.
 *       '404':
 *         description: Producto no encontrado.
 *       '500':
 *         description: Error del servidor.
 */

const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (product) {
    return res.json(product);
  } else {
    res.status(404);
    throw new Error('Resource not found');
  }
});

// @desc    Crear Producto
// @route   POST /api/products
// @access  Private/Admin

/**
 * @swagger
 * /api/products:
 *   post:
 *     tags:
 *       - Productos
 *     summary: Crear un nuevo producto
 *     description: Crea un nuevo producto con la información proporcionada.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Nombre del producto.
 *               price:
 *                 type: number
 *                 description: Precio del producto.
 *               image:
 *                 type: string
 *                 description: URL de la imagen del producto.
 *               brand:
 *                 type: string
 *                 description: Marca del producto.
 *               category:
 *                 type: string
 *                 description: Categoría del producto.
 *               countInStock:
 *                 type: number
 *                 description: Cantidad disponible en stock.
 *               description:
 *                 type: string
 *                 description: Descripción del producto.
 *             required:
 *               - name
 *               - price
 *               - image
 *               - brand
 *               - category
 *               - countInStock
 *               - description
 *     responses:
 *       '201':
 *         description: Producto creado exitosamente.
 *       '400':
 *         description: Datos de producto no válidos.
 *       '500':
 *         description: Error interno del servidor.
 */
const createProduct = asyncHandler(async (req, res) => {
  const product = new Product({
    name: 'Sample name',
    price: 0,
    user: req.user._id,
    image: '/images/sample.jpg',
    brand: 'Sample brand',
    category: 'Sample category',
    countInStock: 0,
    numReviews: 0,
    description: 'Sample description',
  });

  const createdProduct = await product.save();
  res.status(201).json(createdProduct);
});

// @desc    Actualizar producto
// @route   PUT /api/products/:id
// @access  Private/Admin

/**
 * @swagger
 * /api/products/{id}:
 *   put:
 *     tags:
 *       - Productos
 *     summary: Actualizar un producto existente
 *     description: Actualiza la información de un producto existente identificado por su ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del producto a actualizar.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Nuevo nombre del producto.
 *               price:
 *                 type: number
 *                 description: Nuevo precio del producto.
 *               description:
 *                 type: string
 *                 description: Nueva descripción del producto.
 *               image:
 *                 type: string
 *                 description: Nueva URL de la imagen del producto.
 *               brand:
 *                 type: string
 *                 description: Nueva marca del producto.
 *               category:
 *                 type: string
 *                 description: Nueva categoría del producto.
 *               countInStock:
 *                 type: number
 *                 description: Nueva cantidad disponible en stock del producto.
 *             required:
 *               - name
 *               - price
 *               - description
 *               - image
 *               - brand
 *               - category
 *               - countInStock
 *     responses:
 *       '200':
 *         description: Producto actualizado exitosamente.
 *       '404':
 *         description: Producto no encontrado.
 *       '500':
 *         description: Error interno del servidor.
 */
const updateProduct = asyncHandler(async (req, res) => {
  const { name, price, description, image, brand, category, countInStock } =
    req.body;

  const product = await Product.findById(req.params.id);

  if (product) {
    product.name = name;
    product.price = price;
    product.description = description;
    product.image = image;
    product.brand = brand;
    product.category = category;
    product.countInStock = countInStock;

    const updatedProduct = await product.save();
    res.json(updatedProduct);
  } else {
    res.status(404);
    throw new Error('Product not found');
  }
});

// @desc    Emilinar producto
// @route   DELETE /api/products/:id
// @access  Private/Admin

/**
 * @swagger
 * /api/products/{id}:
 *   delete:
 *     tags:
 *       - Productos
 *     summary: Eliminar un producto existente
 *     description: Elimina un producto existente identificado por su ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del producto a eliminar.
 *     responses:
 *       '200':
 *         description: Producto eliminado exitosamente.
 *       '404':
 *         description: Producto no encontrado.
 *       '500':
 *         description: Error interno del servidor.
 */
const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (product) {
    await Product.deleteOne({ _id: product._id });
    res.json({ message: 'Producto Eliminado!' });
  } else {
    res.status(404);
    throw new Error('Producto no encontrado');
  }
});

// @desc    Create new review
// @route   POST /api/products/:id/reviews
// @access  Private

/**
 * @swagger
 * /api/products/{id}/reviews:
 *   post:
 *     tags:
 *       - Productos
 *     summary: Agregar una reseña a un producto
 *     description: Agrega una nueva reseña a un producto existente identificado por su ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del producto al cual se le agregará la reseña.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               rating:
 *                 type: number
 *                 description: Calificación de la reseña (entre 1 y 5).
 *               comment:
 *                 type: string
 *                 description: Comentario de la reseña.
 *             required:
 *               - rating
 *               - comment
 *     responses:
 *       '201':
 *         description: Reseña agregada exitosamente.
 *       '400':
 *         description: La reseña ya ha sido agregada anteriormente por el mismo usuario.
 *       '404':
 *         description: Producto no encontrado.
 *       '500':
 *         description: Error interno del servidor.
 */

const createProductReview = asyncHandler(async (req, res) => {
  const { rating, comment } = req.body;

  const product = await Product.findById(req.params.id);

  if (product) {
    const alreadyReviewed = product.reviews.find(
      (r) => r.user.toString() === req.user._id.toString()
    );

    if (alreadyReviewed) {
      res.status(400);
      throw new Error('Product already reviewed');
    }

    const review = {
      name: req.user.name,
      rating: Number(rating),
      comment,
      user: req.user._id,
    };

    product.reviews.push(review);

    product.numReviews = product.reviews.length;

    product.rating =
      product.reviews.reduce((acc, item) => item.rating + acc, 0) /
      product.reviews.length;

    await product.save();
    res.status(201).json({ message: 'Review added' });
  } else {
    res.status(404);
    throw new Error('Product not found');
  }
});

// @desc    Get top rated products
// @route   GET /api/products/top
// @access  Public
/**
 * @swagger
 * /api/products/top:
 *   get:
 *     summary: Obtiene los productos mejor valorados
 *     description: Obtiene los productos mejor valorados en la tienda.
 *     tags:
 *       - Productos
 *     responses:
 *       '200':
 *         description: Productos obtenidos exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Product'
 *       '500':
 *         description: Error del servidor
 */
const getTopProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({}).sort({ rating: -1 }).limit(3);

  res.json(products);
});


export {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  createProductReview,
  getTopProducts,
};
