import express from "express";
import { isLoggedInAPI } from "../guards";
import { userController } from "../server";

export const userRoutes = express.Router();

userRoutes.post("/signup", userController.signup);
userRoutes.post("/login", userController.login);
userRoutes.get("/users/info", isLoggedInAPI, userController.getUserInfo);
userRoutes.delete("/logout", userController.logout);
//userRoutes.get("/login/google", userController.loginGoogle);
