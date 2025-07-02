import { Request, Response } from "express";
import mongoose, { Document } from "mongoose";
import { asyncHandler } from "../../utils";
import { User } from "../../models/user.model";
import Order from "../../models/order.model";

interface ParkingDetails {
  _id: mongoose.Types.ObjectId;
  name: string;
  address: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  hourlyRate: number;
  dailyRate: number;
  imageUrl: string;
  distanceInKm?: number;
}

interface OrderWithParking extends Document {
  _id: mongoose.Types.ObjectId;
  parkingId: ParkingDetails;
  startTime: Date;
  endTime: Date;
  totalAmount: number;
  vehicleType: string;
  status: string;
  vehicleNumber: string;
  parkingDetails: ParkingDetails;
  remainingTime?: {
    hours: number;
    minutes: number;
    text: string;
    expired: boolean;
  };
  createdAt: Date;
  updatedAt: Date;
  __v: number;
}

export const userControllers = {
  getUserProfile: asyncHandler(async (req: Request, res: Response) => {
    try {
      const userId = req.user?.userId;

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: "Authentication required",
        });
      }

      const user = await User.findById(userId)
        .select("-password -userVerification.verificationToken")
        .lean();

      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }

      if (user.isBlocked || user.isDeleted) {
        return res.status(403).json({
          success: false,
          message: "User account is inactive",
        });
      }

      const activeOrder = (await Order.findOne({
        userId,
        status: {
          $in: ["created", "confirmed", "pendingApproval"],
        },
      })
        .sort({ createdAt: -1 })
        .populate({
          path: "parkingId",
          select: "name address coordinates hourlyRate dailyRate imageUrl",
        })
        .lean()) as unknown as OrderWithParking;

      const formattedActiveOrder = activeOrder
        ? {
            orderId: activeOrder._id,
            parkingId: activeOrder.parkingId,
            startTime: activeOrder.startTime,
            endTime: activeOrder.endTime,
            totalAmount: activeOrder.totalAmount,
            vehicleType: activeOrder.vehicleType,
            status: activeOrder.status,
            vehicleNumber: activeOrder.vehicleNumber,
            parkingDetails: {
              name: activeOrder.parkingId.name,
              address: activeOrder.parkingId.address,
              coordinates: activeOrder.parkingId.coordinates,
              hourlyRate: activeOrder.parkingId.hourlyRate,
              dailyRate: activeOrder.parkingId.dailyRate,
              imageUrl: activeOrder.parkingId.imageUrl,
              distanceInKm: activeOrder.parkingId.distanceInKm,
            },
          }
        : null;

      // Calculate remaining time for active order if it exists
      if (formattedActiveOrder) {
        const endTime = new Date(formattedActiveOrder.endTime);
        const currentTime = new Date();
        const remainingMs = Math.max(
          0,
          endTime.getTime() - currentTime.getTime()
        );
        const remainingHours = Math.floor(remainingMs / (1000 * 60 * 60));
        const remainingMinutes = Math.floor(
          (remainingMs % (1000 * 60 * 60)) / (1000 * 60)
        );

        formattedActiveOrder.remainingTime = {
          hours: remainingHours,
          minutes: remainingMinutes,
          text: `${remainingHours}h ${remainingMinutes}m`,
          expired: remainingMs <= 0,
        };
      }

      // Get order statistics
      const orderStats = {
        activeCount: await Order.countDocuments({
          userId,
          status: { $in: ["created", "confirmed", "pendingApproval"] },
        }),
        completedCount: await Order.countDocuments({
          userId,
          status: "completed",
        }),
        cancelledCount: await Order.countDocuments({
          userId,
          status: "cancelled",
        }),
      };

      return res.status(200).json({
        success: true,
        data: {
          user,
          activeOrder: formattedActiveOrder,
          stats: orderStats,
        },
      });
    } catch (error) {
      console.error("Error getting user profile:", error);
      return res.status(500).json({
        success: false,
        message: "Error retrieving user profile",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }),
  getUserDetails: asyncHandler(async (req: Request, res: Response) => {
    try {
      const userId = req.user?.userId;

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: "Authentication required",
        });
      }

      const user = await User.findById(userId).select(
        "-password -userVerification.verificationToken"
      );

      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }

      if (user.isBlocked || user.isDeleted) {
        return res.status(403).json({
          success: false,
          message: "User account is inactive",
        });
      }
      const activeOrdersCount = await Order.countDocuments({
        userId,
        status: { $in: ["created", "confirmed"] },
      });

      const completedOrdersCount = await Order.countDocuments({
        userId,
        status: "completed",
      });

      return res.status(200).json({
        success: true,
        data: {
          user,
          stats: {
            activeOrders: activeOrdersCount,
            completedOrders: completedOrdersCount,
          },
        },
      });
    } catch (error) {
      console.error("Error getting user details:", error);
      return res.status(500).json({
        success: false,
        message: "Error retrieving user details",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }),

  getActiveOrderOfAUser: asyncHandler(async (req: Request, res: Response) => {
    try {
      const userId = req.user?.userId;

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: "Authentication required",
        });
      }

      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const skip = (page - 1) * limit;

      const activeOrders = await Order.find({
        userId,
        status: { $in: ["created", "confirmed"] },
      })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate({
          path: "parkingId",
          select: "name address coordinates hourlyRate dailyRate imageUrl",
        });

      const totalOrders = await Order.countDocuments({
        userId,
        status: { $in: ["created", "confirmed"] },
      });

      if (activeOrders.length === 0) {
        return res.status(200).json({
          success: true,
          message: "No active orders found",
          data: {
            orders: [],
            pagination: {
              total: 0,
              page,
              limit,
              pages: 0,
            },
          },
        });
      }

      const currentTime = new Date();

      const processedOrders = activeOrders.map((order) => {
        const endTime = new Date(order.endTime);
        const remainingMs = Math.max(
          0,
          endTime.getTime() - currentTime.getTime()
        );
        const remainingHours = Math.floor(remainingMs / (1000 * 60 * 60));
        const remainingMinutes = Math.floor(
          (remainingMs % (1000 * 60 * 60)) / (1000 * 60)
        );

        return {
          ...order.toObject(),
          remainingTime: {
            hours: remainingHours,
            minutes: remainingMinutes,
            text: `${remainingHours}h ${remainingMinutes}m`,
            expired: remainingMs <= 0,
          },
        };
      });

      return res.status(200).json({
        success: true,
        data: {
          orders: processedOrders,
          pagination: {
            total: totalOrders,
            page,
            limit,
            pages: Math.ceil(totalOrders / limit),
          },
        },
      });
    } catch (error) {
      console.error("Error getting active orders:", error);
      return res.status(500).json({
        success: false,
        message: "Error retrieving active orders",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }),

  getAllOrdersOfAUser: asyncHandler(async (req: Request, res: Response) => {
    try {
      const userId = req.user?.userId;

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: "Authentication required",
        });
      }

      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const skip = (page - 1) * limit;
      const status = (req.query.status as string) || null;
      const startDate = req.query.startDate
        ? new Date(req.query.startDate as string)
        : null;
      const endDate = req.query.endDate
        ? new Date(req.query.endDate as string)
        : null;
      const vehicleType = (req.query.vehicleType as string) || null;
      const sortBy = (req.query.sortBy as string) || "createdAt";
      const sortOrder = req.query.sortOrder === "asc" ? 1 : -1;

      const filter: any = { userId };

      if (status) {
        filter.status = status;
      }

      if (startDate && endDate) {
        filter.createdAt = {
          $gte: startDate,
          $lte: endDate,
        };
      } else if (startDate) {
        filter.createdAt = { $gte: startDate };
      } else if (endDate) {
        filter.createdAt = { $lte: endDate };
      }

      if (vehicleType) {
        filter.vehicleType = vehicleType;
      }

      const sort: any = {};
      sort[sortBy] = sortOrder;

      const orders = await Order.find(filter)
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .populate({
          path: "parkingId",
          select: "name address coordinates hourlyRate dailyRate imageUrl",
        });

      const totalOrders = await Order.countDocuments(filter);

      const stats = await Order.aggregate([
        { $match: { userId: new mongoose.Types.ObjectId(userId) } },
        {
          $group: {
            _id: "$status",
            count: { $sum: 1 },
            totalAmount: { $sum: "$totalAmount" },
          },
        },
      ]);

      const orderStats = stats.reduce((acc: any, curr) => {
        acc[curr._id] = {
          count: curr.count,
          totalAmount: curr.totalAmount,
        };
        return acc;
      }, {});

      return res.status(200).json({
        success: true,
        data: {
          orders,
          stats: orderStats,
          pagination: {
            total: totalOrders,
            page,
            limit,
            pages: Math.ceil(totalOrders / limit),
          },
        },
      });
    } catch (error) {
      console.error("Error getting all orders:", error);
      return res.status(500).json({
        success: false,
        message: "Error retrieving orders",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }),
  setUserRole: asyncHandler(async (req: Request, res: Response) => {
    try {
      const userId = req.user?.userId;
      const { role } = req.body;
      console.log("role is ", role);
      if (!userId) {
        return res.status(401).json({
          success: false,
          message: "Authentication required",
        });
      }

      if (!mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(400).json({
          success: false,
          message: "Invalid user ID format",
        });
      }

      const validRoles = ["parker", "owner", "admin"];
      if (!role || !validRoles.includes(role)) {
        return res.status(400).json({
          success: false,
          message: "Invalid role. Must be 'parker', 'owner', or 'admin'",
        });
      }

      const currentUser = req.user;
      if (!currentUser) {
        return res.status(401).json({
          success: false,
          message: "Authentication required",
        });
      }

      const userToUpdate = await User.findById(userId);

      if (!userToUpdate) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }

      userToUpdate.role = role;
      await userToUpdate.save();

      const updatedUser = userToUpdate.toObject();

      return res.status(200).json({
        success: true,
        message: `User role updated to ${role}`,
        data: {
          user: updatedUser,
        },
      });
    } catch (error) {
      console.error("Error setting user role:", error);
      return res.status(500).json({
        success: false,
        message: "Error setting user role",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }),
};
