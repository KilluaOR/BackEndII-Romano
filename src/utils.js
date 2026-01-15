import { fileURLToPath } from "url";
import { dirname } from "path";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
export const __dirname = dirname(__filename);

//Hashear la contraseña
export const createHash = (password) =>
  bcrypt.hashSync(password, bcrypt.genSaltSync(10));

//Validar contraseña
export const isValidPassword = (user, password) =>
  bcrypt.compareSync(password, user.password);

// Generar JWT
export const generateToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
      email: user.email,
      role: user.role,
    },
    process.env.JWT_SECRET, // Usa la variable de entorno
    { expiresIn: "24h" }
  );
};

// Validar JWT
export const verifyToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET); // Usa la variable de entorno
  } catch (error) {
    return null;
  }
};
