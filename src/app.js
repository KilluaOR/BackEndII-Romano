import express from "express";
import handlebars from "express-handlebars";
import { __dirname } from "./utils.js";
import viewsRouter from "./routes/views.router.js";
import sessionsRouter from "./routes/session.router.js";
import mongoose from "mongoose";
import MongoStore from "connect-mongo";
import passport from "passport";
import initializePassport from "./config/passport.config.js";
import sessions from "express-session";
import usersRouter from "./routes/user.router.js";
import productsRouter from "./routes/products.router.js";
import { logger } from "./middlewares/logger.js";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 8080;

// Validar que existan las variables de entorno
if (!process.env.MONGO_URI) {
  throw new Error("MONGO_URI no está definida en .env");
}
if (!process.env.COOKIE_SECRET) {
  throw new Error("COOKIE_SECRET no está definida en .env");
}
if (!process.env.JWT_SECRET) {
  throw new Error("JWT_SECRET no está definida en .env");
}
// Iniciamos la conexión con MongoDB
mongoose.connect(process.env.MONGO_URI);

initializePassport();

//Configuramos handlebars
app.engine("handlebars", handlebars.engine());
app.set("views", __dirname + "/views");
app.set("view engine", "handlebars");

// Middlewares incorporados de Express
app.use(express.json()); // Formatea los cuerpos json de peticiones entrantes.
app.use(express.urlencoded({ extended: true })); // Formatea query params de URLs para peticiones entrantes.
app.use(logger);

app.use(cookieParser(process.env.COOKIE_SECRET));

//Configurar sesiones
app.use(
  sessions({
    secret: process.env.COOKIE_SECRET, //Misma clave q se usó para cookies
    resave: false, //No guardar sesión si no hay cambios
    saveUninitialized: false, //No crear sesión hasta que se almacene algo
    store: MongoStore.create({
      mongoUrl: process.env.MONGO_URI, //Guardar sessions en mongodb
      ttl: 3600, //Tirmpo de vida de la sesión en seg(1h)
    }),
  })
);

//Middleware de passport
app.use(passport.initialize());
app.use(passport.session());

app.get("/setcookies", (req, res) => {
  res.cookie("");
});

//Rutas de sesión
app.use("/api/sessions", sessionsRouter);
//Rutas de vistas
app.use("/", viewsRouter);

app.use("/api/users", usersRouter);
app.use("/api/products", productsRouter);

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
