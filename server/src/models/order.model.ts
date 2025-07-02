import mongoose, { Schema, Document } from "mongoose";

export interface IOrder extends Document {
  userId: mongoose.Types.ObjectId;
  parkingId: mongoose.Types.ObjectId;
  startTime: Date;
  endTime: Date;
  status: "created" | "confirmed" | "completed" | "cancelled";
  vehicleType: string;
  vehicleNumber: string;
  totalAmount: number;
  paymentStatus: "pending" | "completed" | "failed";
  paymentId?: string;
  createdAt: Date;
  updatedAt: Date;
}

const OrderSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    parkingId: {
      type: Schema.Types.ObjectId,
      ref: "Parking",
      required: true,
    },
    startTime: {
      type: Date,
      required: true,
    },
    endTime: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: [
        "created",
        "confirmed",
        "completed",
        "cancelled",
        "pendingApproval",
      ],
      default: "created",
    },
    vehicleType: {
      type: String,
      required: true,
    },
    vehicleNumber: {
      type: String,
      required: true,
    },
    totalAmount: {
      type: Number,
      required: true,
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "completed", "failed"],
      default: "pending",
    },
    paymentId: {
      type: String,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Order ||
  mongoose.model<IOrder>("Order", OrderSchema);
