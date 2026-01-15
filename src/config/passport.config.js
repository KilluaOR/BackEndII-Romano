import passport from "passport";
import local from "passport-local";
import GitHubStrategy from "passport-github2";
import userService from "../dao/models/user.model.js";
import { createHash, isValidPassword } from "../utils.js";
import userModel from "../dao/models/user.model.js";

const LocalStrategy = local.Strategy;

//Estrategia local para registro
passport.use(
  "register",
  new LocalStrategy(
    {
      usernameField: "email",
      passReqToCallback: true, //permite pasar el request completon al callback
    },
    async (req, email, password, done) => {
      try {
        //Verifico si el usuario ya existe
        const user = await userModel.findOne({ email });
        if (user) {
          return done(null, false, { message: "El usuario ya existe" });
        }

        //Crear un nuevo usuario
        const newUser = {
          first_name: req.body.first_name,
          last_name: req.body.last_name,
          email: email,
          password: createHash(password), //Hasheamos la contraseña
          role: email === "adminCoder@coder.com" ? "admin" : "user", //Sistema de roles
        };

        const result = await userModel.create(newUser);
        return done(null, result);
      } catch (error) {
        return done(error);
      }
    }
  )
);

//Estrategia local para LOGIN

passport.use()
"login",
new LocalStrategy(
  {
    usernameField: "email",
  },
  async (email, password, done) => {
    try {
      //Buscar usuario por email
      const user = await userModel.findOne({ email });
      if (!user) {
        return done(null, false, { message: "Usuario non encontrado"})
      }
    }
  }
)

const initializePassport = () => {
  passport.use(
    "github",
    new GitHubStrategy({
      clientID: "",
      clientSecret: "",
      callbackURL: "",
    }),
    async (accessToken, refreshToken, profile, done) => {
      try {
        console.log(profile);
        let user = await userService.findOne({ email: profile._json.email });
        if (!user) {
          //El usuario no existia en el sitio web, se lo agrega a la base de datos.
          let newUser = {
            first_name: profile._json.name,
            last_name: "",
            age: 18,
            email: profile._json.email,
            password: "",
          };
          let result = await userService.create(newUser);
          done(null, result);
        } else {
          //El usuario ya existía
          done(null, user);
        }
      } catch (error) {
        return done(error);
      }
    }
  );
};
