import { catchAsync } from "../utils/catchAsync.js";
import Todo from "../models/todo.model.js";
import { errorHandler } from "../utils/errorHandler.js";

export const addTodo = catchAsync(async (req, res, next) => {
  const { title, content, dueDate } = req.body;

  if (!title || !content || !dueDate) {
    return next(errorHandler(400, "Please fill all the required fields"));
  }

  const todo = new Todo({
    title,
    content,
    dueDate: new Date(dueDate),
    user: req.user.id,
  });

  await todo.save();

  res.status(200).json({
    success: true,
    message: "Todo added successfully",
    todo,
  });
});

export const getTodo = catchAsync(async (req, res, next) => {
  if (req.query.userId) {
    if (req.params.userId !== decoded.id) {
      return next(errorHandler(403, "Access forbidden"));
    }
  }
  const limit = parseInt(req.query.limit || 3);
  const skip = parseInt(req.query.skip || 0);
  const sortDirection = req.query.order === "asc" ? 1 : -1;
  const todos = await Todo.find({
    user: req.user.id,
  })
    .limit(limit)
    .skip(skip)
    .sort({ createdAt: sortDirection });
  res.status(200).json({
    success: true,
    data: todos,
  });
});

export const deleteTodo = catchAsync(async (req, res, next) => {
  const todoId = req.params.todoId;
  const userId = req.user.id;

  const todo = await Todo.findById(todoId);
  if (!todo) {
    return next(errorHandler(400, "Todo not found"));
  }

  if (todo.user.toString() !== userId) {
    return next(
      errorHandler(401, "You are not authorized to delete this post")
    );
  }

  await todo.deleteOne();

  res.status(200).json({
    success: true,
    message: "deletion successful",
  });
});

export const updateTodo = catchAsync(async (req, res, next) => {
  const todoId = req.params.todoId;
  const userId = req.user.id;

  const todo = await Todo.findById(todoId);

  if (!todo) {
    return next(errorHandler(400, "Todo not found"));
  }

  if (todo.user.toString() !== userId) {
    return next(
      errorHandler(401, "You are not authorized to update this post")
    );
  }

  const updatedTodo = await Todo.findByIdAndUpdate(
    todoId,
    {
      $set: {
        title: req.body.title,
        content: req.body.content,
        dueDate: new Date(req.body.dueDate),
      },
    },
    { new: true }
  );

  res.status(200).json({
    success: true,
    message: "todo updated successfully",
    data: updatedTodo,
  });
});

export const updateStatus = catchAsync(async (req, res, next) => {
  const todoId = req.params.todoId;
  const userId = req.user.id;

  const todo = await Todo.findById(todoId);

  if (!todo) {
    return next(errorHandler(400, "Todo not found"));
  }

  if (todo.user.toString() !== userId) {
    return next(errorHandler(401, "You are not authorized to update status"));
  }

  todo.status = todo.status === "pending" ? "completed" : "pending";

  await todo.save();

  res.status(200).json({
    success: true,
    message: "status changed",
    data: todo,
  });
});
