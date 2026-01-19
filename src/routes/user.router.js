import { Router } from "express";
import userModel from "../dao/models/user.model.js";
import {
  createUserControllers,
  deleteUserControllers,
  getUserControllers,
  updateUserControllers,
} from "../controllers/user.controller.js";

const router = Router();

// Consultar todos los usuarios
router.get("/", getUserControllers);
// Crear un usuario
router.post("/", createUserControllers);
// Actualizar un usuario
router.put("/:uid", updateUserControllers);
// Eliminar un usuario
router.delete("/:uid", deleteUserControllers);

export default router;
