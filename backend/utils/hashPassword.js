import bcryptjs from "bcryptjs";

export const hashPassword = (password) => {
  return bcryptjs.hash(password, 10);
};
