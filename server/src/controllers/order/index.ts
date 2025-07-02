import mongoose from "mongoose";
import orderModel from "../../models/order.model";
import { Parking } from "../../models/parking.model";
import { User } from "../../models/user.model";
import { asyncHandler } from "../../utils";
import { Response } from "express";
import { Request as ExpressRequest } from "express";

interface Request extends Express.Request {
  params: { orderId: any };
  body: {
    userId: string;
    parkingId: string;
    startTime: Date;
    endTime: Date;
    vehicleType: string;
    vehicleNumber: string;
    totalAmount: number;
    approve?: boolean;
  };
}

export const orderControllers = {
  createNewOrder: asyncHandler(async (req: Request, res: Response) => {
    try {
      const {
        userId,
        parkingId,
        startTime,
        endTime,
        vehicleType,
        vehicleNumber,
        totalAmount,
      } = req.body;

      if (
        !userId ||
        !parkingId ||
        !startTime ||
        !endTime ||
        !vehicleType ||
        !vehicleNumber
      ) {
        return res.status(400).json({
          success: false,
          message: "All fields are required",
        });
      }

      if (
        !mongoose.Types.ObjectId.isValid(userId) ||
        !mongoose.Types.ObjectId.isValid(parkingId)
      ) {
        return res.status(400).json({
          success: false,
          message: "Invalid user ID or parking ID format",
        });
      }

      const parsedStartTime = new Date(startTime);
      const parsedEndTime = new Date(endTime);
      const currentTime = new Date();

      if (isNaN(parsedStartTime.getTime()) || isNaN(parsedEndTime.getTime())) {
        return res.status(400).json({
          success: false,
          message: "Invalid date format",
        });
      }

      const effectiveStartTime =
        parsedStartTime < currentTime ? currentTime : parsedStartTime;

      if (parsedEndTime <= effectiveStartTime) {
        return res.status(400).json({
          success: false,
          message: "End time must be after start time",
        });
      }

      const user = await User.findOne({
        _id: userId,
        isBlocked: false,
        isDeleted: false,
      });

      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found or inactive",
        });
      }
      const parkingSlot = await Parking.findOne({
        _id: parkingId,
        isActive: true,
        isDeleted: false,
      });

      if (!parkingSlot) {
        return res.status(404).json({
          success: false,
          message: "Parking slot not found or inactive",
        });
      }

      if (!parkingSlot.vehicleTypes.includes(vehicleType)) {
        return res.status(400).json({
          success: false,
          message: `Vehicle type "${vehicleType}" is not supported at this parking location`,
        });
      }

      if (parkingSlot.availableSpots <= 0) {
        return res.status(400).json({
          success: false,
          message: "No parking spots available",
        });
      }

      // Check for overlapping bookings
      // const overlappingBooking = await orderModel.findOne({
      //   parkingId,
      //   status: { $in: ["created", "confirmed"] },
      //   $or: [
      //     {
      //       startTime: { $lt: parsedEndTime },
      //       endTime: { $gt: effectiveStartTime },
      //     },
      //   ],
      // });

      // if (overlappingBooking) {
      //   return res.status(400).json({
      //     success: false,
      //     message: "Parking slot is not available for the selected time period",
      //   });
      // }

      // Check for overlapping vehicle bookings
      const overlappingVehicleBooking = await orderModel.findOne({
        vehicleNumber,
        status: { $in: ["created", "confirmed"] },
        $or: [
          {
            startTime: { $lte: effectiveStartTime },
            endTime: { $gte: effectiveStartTime },
          },
          {
            startTime: { $lte: parsedEndTime },
            endTime: { $gte: parsedEndTime },
          },
          {
            startTime: { $gte: effectiveStartTime },
            endTime: { $lte: parsedEndTime },
          },
        ],
      });

      if (overlappingVehicleBooking) {
        return res.status(400).json({
          success: false,
          message:
            "This vehicle already has an overlapping booking for the selected time period",
        });
      }

      // Calculate amount if not provided
      let calculatedAmount = totalAmount;
      if (!calculatedAmount) {
        const durationMs =
          parsedEndTime.getTime() - effectiveStartTime.getTime();
        const durationHours = durationMs / (1000 * 60 * 60);
        const durationDays = durationHours / 24;

        if (durationHours < 24) {
          calculatedAmount = Math.ceil(durationHours) * parkingSlot.hourlyRate;
        } else {
          calculatedAmount = Math.ceil(durationDays) * parkingSlot.dailyRate;
        }
      }

      // Create the order
      const order = new orderModel({
        userId: new mongoose.Types.ObjectId(userId),
        parkingId: new mongoose.Types.ObjectId(parkingId),
        startTime: effectiveStartTime,
        endTime: parsedEndTime,
        vehicleType,
        vehicleNumber,
        totalAmount: calculatedAmount,
        status: "created",
        paymentStatus: "pending",
      });

      // Save the order
      await order.save();

      // Update available spots
      await Parking.updateOne(
        { _id: parkingId },
        { $inc: { availableSpots: -1 } }
      );

      return res.status(201).json({
        success: true,
        message: "Order created successfully",
        data: { order },
      });
    } catch (error) {
      console.error("Error creating order:", error);
      return res.status(500).json({
        success: false,
        message: "Error creating order",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }),
  approveNewOrder: asyncHandler(async (req: Request, res: Response) => {
    try {
      const { orderId } = req.params;
      const { approve } = req.body;

      if (!mongoose.Types.ObjectId.isValid(orderId)) {
        return res.status(400).json({
          success: false,
          message: "Invalid order ID format",
        });
      }

      const currentUser = req.user;
      if (!currentUser) {
        return res.status(401).json({
          success: false,
          message: "Unauthorized access. User not authenticated",
        });
      }

      const order = await orderModel.findById(orderId);
      if (!order) {
        return res.status(404).json({
          success: false,
          message: "Order not found",
        });
      }

      if (order.status !== "created" && order.status !== "pendingApproval") {
        return res.status(400).json({
          success: false,
          message: `Order cannot be approved or declined. Current status: ${order.status}`,
        });
      }

      const isOrderCreator =
        currentUser.userId.toString() === order.userId.toString();

      let isParkingOwner = false;

      if (currentUser.role === "owner") {
        const parking = await Parking.findById(order.parkingId);

        if (!parking) {
          return res.status(404).json({
            success: false,
            message: "Parking details not found",
          });
        }

        isParkingOwner =
          parking.owner.toString() === currentUser.userId.toString();

        if (!isOrderCreator && !isParkingOwner) {
          return res.status(403).json({
            success: false,
            message: "You are not authorized to approve this order",
          });
        }

        console.log("IS PARKING OWNER", isParkingOwner);
        console.log("IS ORDER CREATOR", isOrderCreator);

        if (isParkingOwner) {
          console.log("INSIDE PARKING OWNER");
          if (approve) {
            order.status = "confirmed";
          } else {
            order.status = "cancelled";
          }
        } else {
          if (approve) {
            order.status = "pendingApproval";
          } else {
            order.status = "cancelled";
          }
        }
      }

      await order.save();

      return res.status(200).json({
        success: true,
        message: approve ? "Order approved successfully" : "Order declined",
        data: {
          order: {
            _id: order._id,
            status: order.status,
            updatedAt: order.updatedAt,
            approvedBy: isParkingOwner ? "owner" : "parker",
          },
        },
      });
    } catch (error) {
      console.error("Error processing order:", error);
      return res.status(500).json({
        success: false,
        message: "Server error while processing order",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }),
  getAllActiveOrders: asyncHandler(async (req: Request, res: Response) => {
    try {
      const currentUser = req.user;

      if (!currentUser) {
        return res.status(401).json({
          success: false,
          message: "Authentication required",
        });
      }

      const user = await User.findById(currentUser.userId);
      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }

      if (user.role !== "owner") {
        return res.status(403).json({
          success: false,
          message: "Access denied. Only owners can view their active orders",
        });
      }

      // Get all parking spots owned by the owner
      const ownedParkingSpots = await Parking.find({ owner: user._id }, "_id");

      const parkingIds = ownedParkingSpots.map((spot) => spot._id);

      // Get all active orders for those parking spots
      const activeOrders = await orderModel
        .find({
          parkingId: { $in: parkingIds },
          status: { $in: ["created", "confirmed", "pendingApproval"] },
        })
        .populate({
          path: "parkingId",
          select:
            "name address hourlyRate dailyRate coordinates features imageUrl",
        })
        .sort({ createdAt: -1 })
        .exec();

      return res.status(200).json({
        success: true,
        message: "Active orders retrieved successfully",
        data: {
          orders: activeOrders,
          count: activeOrders.length,
        },
      });
    } catch (error) {
      console.error("Error fetching active orders:", error);
      return res.status(500).json({
        success: false,
        message: "Error fetching active orders",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }),
};
