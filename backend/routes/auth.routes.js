import express from "express";
import { checkAuth } from "../controllers/user.controller.js";
import { verifyToken } from "../utils/verifyUser.js";

const router = express.Router();

router.get("/me", verifyToken, checkAuth);

export default router;
