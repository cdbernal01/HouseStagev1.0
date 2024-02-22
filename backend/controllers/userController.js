import asyncHandler from "../middleware/asyncHandler.js";
import User from "../models/userModel.js";
import generateToken from "../utils/generateToken.js";

// @Description  Autorización usuario y obtener Token para login
// @router       POST /api/users/login
// @access       Public
/**
 * @swagger
 * /api/users/login:
 *   post:
*     tags:
 *       - Usuarios
 *     summary: Autorización de usuario y obtención de token para iniciar sesión
 *     description: Permite a un usuario iniciar sesión y obtener un token de autenticación válido.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Correo electrónico del usuario.
 *               password:
 *                 type: string
 *                 format: password
 *                 description: Contraseña del usuario.
 *             required:
 *               - email
 *               - password
 *     responses:
 *       '200':
 *         description: Inicio de sesión exitoso. Retorna los datos del usuario y un token de autenticación.
 *       '401':
 *         description: Credenciales inválidas. El correo electrónico o la contraseña proporcionados son incorrectos.
 */
const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    generateToken(res, user._id);

    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
    });
  } else {
    res.status(401);
    throw new Error("Invalid email or password");
  }
});

// @Description  Registrar usuario
// @router       POST /api/users
// @access       Public

/**
 * @swagger
 * /api/users:
 *   post:
*     tags:
 *       - Usuarios
 *     summary: Registrar un nuevo usuario
 *     description: Permite registrar un nuevo usuario en el sistema.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Nombre del usuario.
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Correo electrónico del usuario.
 *               password:
 *                 type: string
 *                 format: password
 *                 description: Contraseña del usuario.
 *             required:
 *               - name
 *               - email
 *               - password
 *     responses:
 *       '201':
 *         description: Usuario creado exitosamente. Retorna los datos del usuario y un token de autenticación.
 *       '400':
 *         description: Error al crear el usuario. Los datos proporcionados son inválidos o el usuario ya existe.
 */
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400);
    throw new Error('User already exists');
  }

  const user = await User.create({
    name,
    email,
    password,
  });

  if (user) {
    generateToken(res, user._id);

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
    });
  } else {
    res.status(400);
    throw new Error('Invalid user data');
  }
});

// @Description  Logout usuario / limpiar Cookie de login
// @router       POST /api/users/logout
// @access       Private

/**
 * @swagger
 * /api/users/logout:
 *   post:
 *     tags:
 *       - Usuarios
 *     summary: Cerrar sesión de usuario y limpiar cookie de autenticación
 *     description: Permite al usuario cerrar sesión y limpiar la cookie de autenticación.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: Sesión cerrada exitosamente.
 */
const logoutUser = asyncHandler(async (req, res) => {
  res.cookie("jwt", "", {
    httpOnly: true,
    expires: new Date(0),
  });

  res.status(200).json({ message: "Logged out successfully" });
});

// @Description  Obtener perfil de usuario.
// @router       GET /api/users/profile
// @access       Public

/**
 * @swagger
 * /api/users/profile:
 *   get:
 *     tags:
 *       - Usuarios
 *     summary: Obtener perfil de usuario
 *     description: Permite a un usuario obtener su propio perfil.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: Perfil de usuario obtenido exitosamente.
 *       '400':
 *         description: Error al obtener el perfil de usuario. El usuario no existe.
 */
const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
    });
  } else {
    res.status(400);
    throw new Error("User not found");
  }
});

// @Description  Actualizar perfil de usuario.
// @router       PUT /api/users/profile
// @access       Private

/**
 * @swagger
 * /api/users/profile:
 *   put:
 *     tags:
 *       - Usuarios
 *     summary: Actualizar perfil de usuario
 *     description: Permite a un usuario actualizar su propio perfil.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Nuevo nombre del usuario.
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Nuevo correo electrónico del usuario.
 *               password:
 *                 type: string
 *                 format: password
 *                 description: Nueva contraseña del usuario.
 *             required:
 *               - name
 *               - email
 *     responses:
 *       '200':
 *         description: Perfil de usuario actualizado exitosamente.
 *       '400':
 *         description: Error al actualizar el perfil de usuario. El usuario no existe.
 */
const updateUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;

    if (req.body.password) {
      user.password = req.body.password;
    }

    const updatedUser = await user.save();

    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
    });
  } else {
    res.status(400);
    throw new Error("User not found");
  }
});

// @Description  Obtener todos los perfiles de usuario
// @router       GET /api/users
// @access       Private/Admin

/**
 * @swagger
 * /api/users:
 *   get:
 *     tags:
 *       - Usuarios
 *     summary: Obtener todos los perfiles de usuario
 *     description: Permite a un usuario con rol de administrador obtener todos los perfiles de usuario registrados en el sistema.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: Perfiles de usuario obtenidos exitosamente.
 */

const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find({});
  res.status(200).json(users);
});


// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private/Admin

/**
 * @swagger
 * /api/users/{id}:
 *   delete:
 *     tags:
 *       - Usuarios
 *     summary: Eliminar usuario
 *     description: Permite a un usuario con rol de administrador eliminar un usuario existente en el sistema.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID del usuario a eliminar
 *     responses:
 *       '200':
 *         description: Usuario eliminado exitosamente.
 *       '400':
 *         description: No se puede eliminar un usuario administrador.
 *       '404':
 *         description: Usuario no encontrado.
 */

const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (user) {
    if (user.isAdmin) {
      res.status(400);
      throw new Error('Can not delete admin user');
    }
    await User.deleteOne({ _id: user._id });
    res.json({ message: 'User deleted' });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// @desc    Get user by ID
// @route   GET /api/users/:id
// @access  Private/Admin

/**
 * @swagger
 * /api/users/{id}:
 *   get:
 *     tags:
 *       - Usuarios
 *     summary: Obtener usuario por ID
 *     description: Permite a un usuario con rol de administrador obtener un usuario específico por su ID.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID del usuario a obtener
 *     responses:
 *       '200':
 *         description: Usuario obtenido exitosamente.
 *       '404':
 *         description: Usuario no encontrado.
 */

const getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select('-password');

  if (user) {
    res.json(user);
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});


// @desc    Update user
// @route   PUT /api/users/:id
// @access  Private/Admin

/**
 * @swagger
 * /api/users/{id}:
 *   put:
 *     tags:
 *       - Usuarios
 *     summary: Actualizar usuario por ID
 *     description: Permite a un usuario con rol de administrador actualizar un usuario específico por su ID.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID del usuario a actualizar
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Nuevo nombre del usuario.
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Nuevo correo electrónico del usuario.
 *               isAdmin:
 *                 type: boolean
 *                 description: Nuevo estado de administrador del usuario.
 *     responses:
 *       '200':
 *         description: Usuario actualizado exitosamente.
 *       '404':
 *         description: Usuario no encontrado.
 */

const updateUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    user.isAdmin = Boolean(req.body.isAdmin);

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      isAdmin: updatedUser.isAdmin,
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

export {
  authUser,
  registerUser,
  logoutUser,
  getUserProfile,
  updateUserProfile,
  getUsers,
  deleteUser,
  getUserById,
  updateUser,
};
