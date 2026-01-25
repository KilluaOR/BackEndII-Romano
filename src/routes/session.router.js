import { Router } from "express";
import { currentController, githubCallbackController, githubController, loginController, logoutController, registerController } from "../controllers/session.controllers.js";


const router = Router();

//Ruta de registro
router.post("/register", registerController);

//Ruta de login
router.post("/login", loginController);

//Ruta para obtener usuario actual mediante JWT
router.get("/current", currentController);

//Ruta para iniciar autenticación con GitHub
router.get("/github", githubController);

//Callback de GitHub
router.get("/githubcallback", githubCallbackController);

//Ruta del logout
router.post("/logout", logoutController);

export default router;