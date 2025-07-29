import { Request, Response } from "express";
import mongoose from "mongoose";
import { Payment } from "../../models/payment.model";
import orderModel from "../../models/order.model";
import { asyncHandler } from "../../utils";
import { razorpayService } from "../../services/razorpay";
import { IRequestWithUser } from "../../@types";

export const paymentControllers = {
  initializePayment: asyncHandler(async (req: Request, res: Response) => {
    try {
      const { orderId } = req.body;

      if (!orderId || !mongoose.Types.ObjectId.isValid(orderId)) {
        return res.status(400).json({
          success: false,
          message: "Valid order ID is required",
        });
      }

      const order = await orderModel.findById(orderId);

      if (!order) {
        return res.status(404).json({
          success: false,
          message: "Order not found",
        });
      }

      if (order.paymentStatus === "completed") {
        return res.status(400).json({
          success: false,
          message: "Payment for this order is already completed",
        });
      }

      const startTime = new Date(order.startTime);
      const endTime = new Date(order.endTime);
      const durationHours =
        (endTime.getTime() - startTime.getTime()) / (1000 * 60 * 60);
      const durationType = durationHours < 24 ? "hourly" : "daily";

      const razorpayOrder = await razorpayService.createOrder({
        amount: order.totalAmount,
        receipt: `order_rcpt_${order._id}`,
        notes: {
          orderId: order._id.toString(),
          parkingId: order.parkingId.toString(),
          userId: order.userId.toString(),
          vehicleNumber: order.vehicleNumber,
        },
      });

      const payment = new Payment({
        parkingId: order.parkingId,
        userId: order.userId,
        razorpayOrderId: razorpayOrder.id,
        amount: order.totalAmount,
        currency: "INR",
        status: "created",
        startTime: order.startTime,
        endTime: order.endTime,
        durationType,
        receipt: `order_rcpt_${order._id}`,
        notes: {
          orderId: order._id.toString(),
          vehicleNumber: order.vehicleNumber,
          vehicleType: order.vehicleType,
        },
      });

      await payment.save();

      order.paymentId = (payment as any)._id.toString();
      await order.save();

      // Return payment details to client
      return res.status(200).json({
        success: true,
        message: "Payment initialized successfully",
        data: {
          paymentId: payment._id,
          razorpayOrderId: razorpayOrder.id,
          amount: Number(razorpayOrder.amount) / 100,
          currency: razorpayOrder.currency,
          key_id: process.env.RAZORPAY_KEY_ID,
          prefill: {
            name: "Satyam",
            email: "satyamsingh748846@gmail.com",
            contact: "8789373766",
          },
          notes: {
            orderId: order._id.toString(),
            parkingLocation: order.parkingId.toString(),
            vehicleNumber: order.vehicleNumber,
          },
        },
      });
    } catch (error) {
      console.error("Error initializing payment:", error);

      return res.status(500).json({
        success: false,
        message: "Error initializing payment",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }),

  verifyPayment: asyncHandler(async (req: Request, res: Response) => {
    try {
      const { razorpayOrderId, razorpayPaymentId, razorpaySignature } =
        req.body;

      if (!razorpayOrderId || !razorpayPaymentId || !razorpaySignature) {
        return res.status(400).json({
          success: false,
          message: "All payment details are required",
        });
      }

      const isValidSignature = razorpayService.verifyPaymentSignature(
        razorpayOrderId,
        razorpayPaymentId,
        razorpaySignature
      );

      if (!isValidSignature) {
        return res.status(400).json({
          success: false,
          message: "Invalid payment signature",
        });
      }

      const paymentDetails =
        await razorpayService.fetchPaymentDetails(razorpayPaymentId);

      const payment = await Payment.findOne({ razorpayOrderId });

      if (!payment) {
        return res.status(404).json({
          success: false,
          message: "Payment record not found",
        });
      }

      payment.razorpayPaymentId = razorpayPaymentId;
      payment.razorpaySignature = razorpaySignature;
      payment.status =
        paymentDetails.status === "captured" ? "captured" : "authorized";
      payment.paymentMethod = paymentDetails.method;
      await payment.save();

      const order = await orderModel.findOne({ paymentId: payment._id });

      if (!order) {
        return res.status(404).json({
          success: false,
          message: "Order not found for this payment",
        });
      }

      order.paymentStatus = "completed";
      order.status = "pendingApproval";
      await order.save();

      return res.status(200).json({
        success: true,
        message: "Payment verified successfully",
        data: {
          orderId: order._id,
          paymentId: payment._id,
          amount: payment.amount,
          status: payment.status,
        },
      });
    } catch (error) {
      console.error("Error verifying payment:", error);

      return res.status(500).json({
        success: false,
        message: "Error verifying payment",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }),

  getPaymentDetails: asyncHandler(async (req: IRequestWithUser, res: Response) => {
    try {
      const { paymentId } = req.params;

      if (!paymentId || !mongoose.Types.ObjectId.isValid(paymentId)) {
        return res.status(400).json({
          success: false,
          message: "Valid payment ID is required",
        });
      }

      const payment = await Payment.findById(paymentId);

      if (!payment) {
        return res.status(404).json({
          success: false,
          message: "Payment not found",
        });
      }

      if (
        payment.userId.toString() !== req.customUser?._id &&
        req.customUser?.userType !== "admin"
      ) {
        return res.status(403).json({
          success: false,
          message: "Unauthorized to view this payment",
        });
      }

      return res.status(200).json({
        success: true,
        data: payment,
      });
    } catch (error) {
      console.error("Error getting payment details:", error);

      return res.status(500).json({
        success: false,
        message: "Error getting payment details",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }),
};
