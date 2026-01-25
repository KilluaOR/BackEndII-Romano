import passport from "passport";
import { generateToken } from "../utils.js";

//Controlador de registro
export const registerController = passport.authenticate("register", {
    failureRedirect: "/login?error=El usuario ya existe",
    successRedirect: "/login?success=Usuario registrado correctamente",
});

//Controlador de login con JWT
export const loginController = async (req, res, next) => {
    passport.authenticate("login", { session: false }, async (err, user, info ) => {
        try {
            if (err || !user) {
                return res.status(401).json({
                    status: "error",
                    message: info?.message || "Error en la autenticación",
                });
            }

            //Generar token JWT
            const token = generateToken(user);

            //Retronar token y datos del usuario (sin password)
            const userData = {
                _id: user._id,
                first_name: user.first_name,
                last_name: user.last_name,
                email: user.email,
                age: user.age,
                role: user.role,
            };
            return res.json({
                status: "success",
                token,
                user: userData,
            });
        } catch (error) {
            return res.status(500).json({
                status: "error",
                message: "Error al generar token",
            });
        }
    })(req, res, next);
};

//Controlador para iniciar autenticación con GitHub
export const githubController = passport.authenticate("github", {
    scope: ["user:email"],
});

//Controlador callback de GitHub
export const githubCallbackController = passport.authenticate("github", {
    failureRedirect: "/login?error=Error al autenticar con GitHub",
    successRedirect: "/current",
});

//Controlador logout
export const logoutController = (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).json({ error: "Error al cerrar sesión" });
        }
        res.clearCookie("connect.sid");
        res.redirect("/login");
    });
};

//Controlador para obtener el usuario actual mediante JWT
export const currentController = async (req, res, next) => {
    passport.authenticate("current", { session: false }, (err, user, info) => {
        if (err) {
            return res.status(500).json({
                status: "error",
                message: "Error en la autenticación",
            });
        }
        if (!user) {
            return res.status(401).json({
                status: "error",
                message: info?.message || "Token inválido o expirado",
            });
        }

        //Retornar datos del usuario (sin password)
        const userData = {
            _id: user._id,
            first_name: user.first_name,
            last_name: user.last_name,
            email: user.email,
            age: user.age,
            role: user.role,
        };

        return res.json({
            status: "success",
            user: userData,
        });
    })(req, res, next);
};