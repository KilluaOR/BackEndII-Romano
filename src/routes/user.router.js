import { Router } from "express";
import userModel from "../dao/models/user.model.js";
import {
  createUserControllers,
  getUserControllers,
  updateUserControllers,
} from "../controllers/user.controllers.js";

const router = Router();

// Consultar todos los usuarios
router.get("/", getUserControllers);
// Crear un usuario
router.post("/", createUserControllers);
// Actualizar un usuario
router.put("/:uid", updateUserControllers);
// Eliminar un usuario

export default router;
