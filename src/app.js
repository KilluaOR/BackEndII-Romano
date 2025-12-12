import express from "express";
import mongoose from "mongoose";
import usersRouter from "./routes/userRouter.js";

const app = express();
const PORT = 8080;
// Iniciamos la conexión con MongoDB
const uri = "mongodb://127.0.0.1:27017/class-zero";
mongoose.connect(uri);

// Middlewares incorporados de Express
app.use(express.json()); // Formatea los cuerpos json de peticiones entrantes.
app.use(express.urlencoded({ extended: true })); // Formatea query params de URLs para peticiones entrantes.

app.use("/api/users", usersRouter);

try {
  app.listen(PORT, () => {
    console.log(
      `🚀 ~ express.listen ~ servidor corriendo en el puerto ${PORT}`
    );
  });
} catch (error) {
  console.error("Error al iniciar el servidor:", error);
  process.exit(1);
}
