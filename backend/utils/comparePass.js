import bcryptjs from "bcryptjs";

export const comparePassword = (password, userPassword) =>
  bcryptjs.compare(password, userPassword);
