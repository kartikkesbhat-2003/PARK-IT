import express from "express";
import { userControllers } from "../controllers";
import { authMiddleware } from "../middlewares";

export const userRoutes = express.Router();

userRoutes.get("/profile", authMiddleware, userControllers.getUserProfile);
userRoutes.put("/toggle-role", authMiddleware, userControllers.setUserRole);
