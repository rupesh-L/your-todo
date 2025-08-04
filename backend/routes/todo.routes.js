import express from "express";
import {
  addTodo,
  deleteTodo,
  getTodo,
  updateStatus,
  updateTodo,
} from "../controllers/todo.controller.js";
import { verifyToken } from "../utils/verifyUser.js";

const router = express.Router();

router.post("/", verifyToken, addTodo);
router.get("/", verifyToken, getTodo);
router.delete("/:todoId", verifyToken, deleteTodo);
router.put("/:todoId", verifyToken, updateTodo);
router.post("/:todoId", verifyToken, updateStatus);

export default router;
