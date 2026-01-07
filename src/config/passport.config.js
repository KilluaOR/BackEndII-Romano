import passport from "passport";
import local from "passport-local";
import GitHubStrategy from "passport-github2";
import userService from "../models/user.js";
import { createHash, isValidPassword } from "../utils.js";

const LocalStrategy = local.Strategy;
