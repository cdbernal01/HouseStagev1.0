import asyncHandler from "../middleware/asyncHandler.js";
import User from "../models/userModel.js";
import jwt from "jsonwebtoken";

// @Description  Autorización usuario y obtener Token para login
// @router       POST /api/users/login
// @access       Public
const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "30d",
    }); // funcion JWT para almacenamiento de Token

    res.cookie("jwt", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV !== "development",
      sameSite: "strict",
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 dias
    });

    res.json({
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
const registerUser = asyncHandler(async (req, res) => {
  res.send("register user");
});

// @Description  Logout usuario / limpiar Cookie de login
// @router       POST /api/users/logout
// @access       Private
const logoutUser = asyncHandler(async (req, res) => {
  res.send("logout user");
});

// @Description  Obtener perfil de usuario.
// @router       GET /api/users/profile
// @access       Public
const getUserProfile = asyncHandler(async (req, res) => {
  res.send("get user profile");
});

// @Description  Actualizar perfil de usuario.
// @router       PUT /api/users/profile
// @access       Private
const updateUserProfile = asyncHandler(async (req, res) => {
  res.send("update user profile");
});

// @Description  Obtener todos los perfiles de usuario
// @router       GET /api/users
// @access       Private/Admin
const getUsers = asyncHandler(async (req, res) => {
  res.send("get users");
});

// @Description  Obtener usuario por id
// @router       GET /api/users/:id
// @access       Private/Admin
const getUserById = asyncHandler(async (req, res) => {
  res.send("get users by Id");
});

// @Description  Eliminar usuario
// @router       DELETE /api/users/:id
// @access       Private/Admin
const deleteUser = asyncHandler(async (req, res) => {
  res.send("delete user");
});

// @Description  actualizar usuario
// @router       PUT /api/users/:id
// @access       Private/Admin
const updateUser = asyncHandler(async (req, res) => {
  res.send("update user");
});

export {
  authUser,
  registerUser,
  logoutUser,
  getUserProfile,
  getUserById,
  getUsers,
  updateUserProfile,
  deleteUser,
  updateUser,
};
