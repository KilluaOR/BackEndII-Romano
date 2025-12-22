import mongoose from "mongoose";
import userModel from "../dao/models/user.model.js";

export const getUserControllers = async (req, res) => {
  try {
    const result = await userModel.find();
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
