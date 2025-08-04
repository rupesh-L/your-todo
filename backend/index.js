import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import userRoutes from "./routes/user.route.js";
import todoRoutes from "./routes/todo.routes.js";
import authRoutes from "./routes/auth.routes.js";
import cookieParser from "cookie-parser";
import path from "path";

dotenv.config();

const app = express();

// DB connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Mongo DB connected successfully");
  })
  .catch((err) => {
    console.log(err);
  });

const __dirname = path.resolve();

// Middlewares

app.use(express.json());
app.use(cookieParser());

// Routes
app.use("/api/v1/user", userRoutes);
app.use("/api/v1/todo/todos", todoRoutes);
app.use("/api/v1/auth", authRoutes);

app.use(express.static(path.join(__dirname, "/frontend/dist")));

app.get(/.*/, (req, res) => {
  res.sendFile(path.join(__dirname, "frontend", "dist", "index.html"));
});

// GLOBAL ERROR MIDDLEWARE
app.use((err, req, res, next) => {
  const message = err.message || "Internal server error";
  const statusCode = err.statusCode || 500;

  return res.status(statusCode).json({
    success: false,
    message,
  });
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
