import express from "express";
import MongoStore from "connect-mongo";
import mongoose from "mongoose";

const app = express();
const PORT = 8080;
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

import mongoose from "mongoose";
mongoose.connect("mongodb://localhost:27017/mydatabase");

try {
  httpServer.listen(PORT, () => {
    console.log(`🚀 ~ express.listen ~ servidor corriendo en el puerto PORT`);
  });
} catch (error) {
  console.error("Error al iniciar el servidor:", error);
  process.exit(1);
}
