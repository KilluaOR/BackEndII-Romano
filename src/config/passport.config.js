import passport from "passport";
import local from "passport-local";
import GitHubStrategy from "passport-github2";
import userService from "../models/user.js";
import { createHash, isValidPassword } from "../utils.js";

// const LocalStrategy = local.Strategy;

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
