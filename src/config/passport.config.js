import passport from "passport";
import local from "passport-local";
import GitHubStrategy from "passport-github2";
import { createHash, isValidPassword } from "../utils.js";
import userModel from "../dao/models/user.model.js";
import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt"

const initializePassport = () => {
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
            age: req.body.age,
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

  passport.use(
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
            return done(null, false, { message: "Usuario no encontrado" });
          }

          //Valiar contraseña
          if (!isValidPassword(user, password)) {
            return done(null, false, { message: "Contraseña incorrecta" });
          }

          //Asignar rol de admin si es adminCoder@coder.com
          if (email === "adminCoder@coder.com" && user.role !== "admin") {
            user.role = "admin";
            await userModel.updateOne({ _id: user._id }, { role: "admin" });
          }
          return done(null, user);
        } catch (error) {
          return done(error);
        }
      }
    )
  );

//Estrategia JWT
passport.use(
  "jwt",
  new JwtStrategy(
    {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET,
    },
    async (payload, done) => {
      try {
        const user = await userModel.findById(payload.id);
        if (!user) {
          return done(null, false, { message: "Usuario no encontrado" })
        } 
        return done(null, user);
        } catch (error) {
          return done(error)
      }
    }
  )
);

//Estrategia current para validar usuario desde JWT
passport.use(
  "current",
  new JwtStrategy(
    {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        secretOrKey: process.env.JWT_SECRET,
    },
    async (payload, done) => {
      try {
        const user = await userModel.findById(payload.id);
        if (!user) {
          return done(null, false, { message: "Usuario no encontrado" });
        }
        return done(null, user);
      } catch (error) {
        return done(error, false, { message: "Token inválido o expirado" })
      }
    }
  )
);

  //Estrategia GitHub (solo si están configuradas las variables de entorno)
  if (process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET && process.env.GITHUB_CALLBACK_URL) {
    passport.use(
      "github",
      new GitHubStrategy(
        {
          clientID: process.env.GITHUB_CLIENT_ID,
          clientSecret: process.env.GITHUB_CLIENT_SECRET,
          callbackURL: process.env.GITHUB_CALLBACK_URL,
        },
        async (accessToken, refreshToken, profile, done) => {
          try {
            //Buscar usuario por email
            console.log(profile);
            let user = await userModel.findOne({ email: profile._json.email });
            if (!user) {
              //El usuario no existia en el sitio web, se lo agrega a la base de datos.
              const nameParts = profile._json.name
                ? profile._json.name.split(" ")
                : ["", ""];
              const newUser = {
                first_name: nameParts[0] || profile._json.login,
                last_name: nameParts.slice(1).join(" ") || "",
                email: profile._json.email,
                age: 0,
                password: "", //GitHub no proporciona password
                role: "user",
              };
              const result = await userModel.create(newUser);
              done(null, result);
            } else {
              //El usuario ya existía
              done(null, user);
            }
          } catch (error) {
            return done(error);
          }
        }
      )
    );
  }

    // Serialización y deserialización de usuarios
    passport.serializeUser((user, done) => {
      done(null, user._id);
    });
  
    passport.deserializeUser(async (id, done) => {
      try {
        const user = await userModel.findById(id);
        done(null, user);
      } catch (error) {
        done(error, null);
      }
    });
};

export default initializePassport;
