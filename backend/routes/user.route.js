import express from "express";
import {
  checkAuth,
  registerUser,
  signInUser,
  signOut,
} from "../controllers/user.controller.js";
import { verifyToken } from "../utils/verifyUser.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/signin", signInUser);
router.post("/signout", signOut);
router.get("/me", verifyToken, checkAuth);

export default router;
