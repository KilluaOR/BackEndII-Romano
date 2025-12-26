import mongoose from "mongoose";
import UserManager from "../dao/managers/UserManager.js";
import UserModel from "../dao/models/user.model.js";

const userManager = new UserManager();

export const getUserControllers = async (req, res) => {
  try {
    const result = await UserManager.find();
    res.send({
      status: "success",
      payload: result,
    });
  } catch (error) {
    res.status(500).send({
      status: "error",
      message: error.message,
    });
  }
};

export const createUserControllers = async (req, res) => {
  try {
    const newUser = await userManager.createUser();
    res.setHeader("Content-Type", "application/json");
    return res.status(201).json(newUser);
  } catch (error) {
    console.log(error);
    res.setHeader("Content-Type", "application/json");
    return res.status(500).json({
      error: `Error inesperado en el servidor - Intente más tarde, o contacte a su administrador`,
      detalle: `${error.message}`,
    });
  }
};

export const updateUserControllers = async (req, res) => {
  try {
    const { uid } = req.params;

    const updatedUser = await UserModel.findByIdAndUpdate(uid, req.body, {
      new: true,
      runValidators: true,
    });
    if (!updatedUser) {
      return res.status(400).json({ error: "Usuario no encontrado" });
    }
    const io = req.app.get("io");

    if (io) {
      const users = await UserModel.find().lean();
      io.emit("usuarios", users);
    }
    res.json({
      message: "Usuario actualizado con éxito",
      user: updatedUser,
    });
  } catch (error) {
    console.error("PUT /:uid error", error);
    res.status(500).json({
      error: `Error inesperado en el servidor - Intente más tarde, o contacte a su administrador`,
      detalle: `${error.message}`,
    });
  }
};

export const deleteUserControllers = async (req, res) => {
  try {
    const { uid } = req.params;

    const deleted = await UserModel.findByIdAndDelete(uid);

    if (!deleted) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    const io = req.app.get("io");
    if (io) {
      const users = await UserModel.find().lean();
      io.emit("usuarios", users);
    }
    res.json({
      message: "Usuario eliminado correctamente",
      deleted,
    });
  } catch (error) {
    console.error("DELETE /:uid error:", error);
    res.status(500).json({ error: "Error interno al eliminar el usuario" });
  }
};
