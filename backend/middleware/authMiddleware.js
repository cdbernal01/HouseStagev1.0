import jwt from "jsonwebtoken";
import asyncHandler from "./asyncHandler.js";
import User from "../models/userModel.js";

//Rutas Protegidas

const protect = asyncHandler(async (req, res, next) => {
  let token;

  //Lectura de Token de JWT desde cookies
  token = req.cookies.jwt;
  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.userId).select("-password");
      next();
    } catch (error) {
      console.error(error);
      res.status(401);
      throw new Error(" No authorized session, token failed");
    }
  } else {
    res.status(401);
    throw new Error(" No authorized session, no token found");
  }
});

//Admin middleware
const admin = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    res.status(401);
    throw new Error(" No authorized session, as Admin");
  }
};

export { protect, admin };
