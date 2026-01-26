import { Router } from "express";

const router = Router();

// Ruta para la página principal (home)
router.get("/", (req, res) => {
    res.render("home"), {
        title: "Home"
    };
});

// Ruta para la página de login
router.get("/login", (req, res) => {
    res.render("login", {
        title: "Login",
        error: req.query.error,
        success: req.query.success
    });
});

// Ruta para la página de registro
router.get("/register", (req, res) => {
    res.render("register", {
        title: "Registro",
        error: req.query.error,
        success: req.query.success
    });
});

export default router;
