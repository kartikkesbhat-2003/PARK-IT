import express from "express";
import { authControllers } from "../controllers";

export const authRouter = express.Router();

authRouter.post("/register", authControllers.register);
authRouter.get(
  "/is-email-verified/:userId",
  authControllers.checkIsEmailVerified
);

authRouter.get("/verify-user/:token", authControllers.verifyToken);
authRouter.post("/login", authControllers.login);
