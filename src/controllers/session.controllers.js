import passport from "passport";

//Controlador de registro
export const registerController = passport.authenticate("register", {
    failureRedirect: "/login?error=El usuario ya existe",
    successRedirect: "/login?success=Usuario registrado correctamente",
});

//Controlador de login
export const loginController = passport.authenticate("login", {
    failureRedirect: "/login?error=Credenciales incorrectas",
    successRedirect: "/current",
});

//Controlador para iniciar autenticación con GitHub
export const githubController = passport.authenticate("github", {
    scope: ["user:email"],
})

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
}