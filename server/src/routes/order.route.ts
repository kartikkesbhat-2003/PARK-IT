import express from "express";
import { orderControllers } from "../controllers";
import { authMiddleware } from "../middlewares";
import { parkerAuthMiddleware } from "../middlewares/owner.middleware";
export const orderRoutes = express.Router();

orderRoutes.post("/create", authMiddleware, orderControllers.createNewOrder);

orderRoutes.get(
  "/active",
  parkerAuthMiddleware,
  orderControllers.getAllActiveOrders
);

orderRoutes.put(
  "/:orderId/approve",
  authMiddleware,
  orderControllers.approveNewOrder
);
