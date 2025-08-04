import User from "../models/user.model.js";
import jwt from "jsonwebtoken";
import { catchAsync } from "../utils/catchAsync.js";
import { comparePassword } from "../utils/comparePass.js";
import { errorHandler } from "../utils/errorHandler.js";
import { hashPassword } from "../utils/hashPassword.js";

export const checkAuth = catchAsync(async (req, res, next) => {
  res.status(200).json({
    success: true,
  });
});

export const registerUser = catchAsync(async (req, res, next) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return next(errorHandler(400, "Please fill all the required fields"));
  }

  const user = await User.findOne({ email });

  if (user) {
    return next(errorHandler(400, "Email already registered"));
  }

  if (password.length < 6) {
    return next(
      errorHandler(400, "password must be atleast 6 characters long")
    );
  }

  const hashedPassword = await hashPassword(password);

  const newUser = new User({
    username,
    email,
    password: hashedPassword,
  });

  await newUser.save();
  res.status(201).json({
    success: true,
    message: "User registered successfully",
  });
});

export const signInUser = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(errorHandler(400, "Please fill all the required fields"));
  }

  const user = await User.findOne({ email });

  if (!user) {
    return next(errorHandler(400, "Email is not registered"));
  }

  const isValid = await comparePassword(password, user.password);

  if (isValid) {
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    const { password: pass, ...rest } = user._doc;
    res.cookie("access_token", token, {
      httpOnly: true,
      maxAge: 60 * 60 * 1000,
    });

    res.status(200).json({
      success: true,
      message: "Sign in successful",
      user: rest,
    });
  } else {
    return next(errorHandler(401, "Invalid credentials"));
  }
});

export const signOut = catchAsync(async (req, res, next) => {
  try {
    res
      .clearCookie("access_token")
      .status(200)
      .json("User has been signed out");
  } catch (error) {
    next(error);
  }
});
