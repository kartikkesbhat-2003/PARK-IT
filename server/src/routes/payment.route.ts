import express from "express";

export const paymentRoutes = express.Router();

import { paymentControllers } from "../controllers/payment";
import { authMiddleware } from "../middlewares";

paymentRoutes.post(
  "/initialize",
  authMiddleware,
  paymentControllers.initializePayment
);
paymentRoutes.post("/verify", authMiddleware, paymentControllers.verifyPayment);
paymentRoutes.post(
  "/:paymentId",
  authMiddleware,
  paymentControllers.getPaymentDetails
);
