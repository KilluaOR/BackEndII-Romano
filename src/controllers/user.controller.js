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

export const createUserControllers = async (req, res) => {
  const { first_name, last_name, age, email } = req.body;
  try {
    const result = await userModel.create({ first_name, last_name, age, email });
    res.send({
      status: "success",
      payload: result,
    });
  } catch (error) {
    res.status(400).send({
      status: "error",
      message: error.message,
    });
  }
};

export const updateUserControllers = async (req, res) => {
  const { uid } = req.params;
  const { first_name, last_name, age, email } = req.body;
  try {
    const user = await userModel.findOne({ _id: uid });
    if (!user) throw new Error("User not found");

    const newUser = {
      first_name: first_name ?? user.first_name,
      last_name: last_name ?? user.last_name,
      age: age ?? user.age,
      email: email ?? user.email,
    };

    const updateUser = await userModel.updateOne({ _id: uid }, newUser);
    res.send({
      status: "success",
      payload: updateUser,
    });
  } catch (error) {
    res.status(400).send({
      status: "error",
      message: error.message,
    });
  }
};

export const deleteUserControllers = async (req, res) => {
  try {
    const { uid } = req.params;

    const result = await userModel.deleteOne({ _id: uid });

    res.status(200).send({
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
