import jwt from "jsonwebtoken";
import { errorHandler } from "./errorHandler.js";

export const verifyToken = (req, res, next) => {
  const token = req.cookies.access_token;
  if (!token) {
    return next(errorHandler(401, "Unauthorized"));
  }
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return next(errorHandler(401, "Unauthorized"));
    }

    if (req.query.userId) {
      if (req.params.userId !== decoded.id) {
        return next(errorHandler(403, "Access forbidden"));
      }
    }
    req.user = decoded;
    next();
  });
};
