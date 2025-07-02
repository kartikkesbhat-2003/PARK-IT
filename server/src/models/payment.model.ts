import mongoose, { Document, Schema } from "mongoose";

interface IPayment extends Document {
  parkingId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  razorpayOrderId: string;
  razorpayPaymentId: string;
  razorpaySignature?: string;
  amount: number;
  currency: string;
  status: "created" | "authorized" | "captured" | "failed" | "refunded";
  startTime?: Date;
  endTime?: Date;
  durationType: "hourly" | "daily";
  paymentMethod?: string;
  receipt?: string;
  notes?: any;
  createdAt: Date;
  updatedAt: Date;
}

const PaymentSchema = new Schema<IPayment>(
  {
    parkingId: {
      type: Schema.Types.ObjectId,
      ref: "Parking",
      required: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    razorpayOrderId: {
      type: String,
      required: true,
      unique: true,
    },
    razorpayPaymentId: {
      type: String,
      sparse: true,
    },
    razorpaySignature: {
      type: String,
      sparse: true,
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    currency: {
      type: String,
      default: "INR",
    },
    status: {
      type: String,
      required: true,
      enum: ["created", "authorized", "captured", "failed", "refunded"],
      default: "created",
    },
    startTime: {
      type: Date,
    },
    endTime: {
      type: Date,
    },
    durationType: {
      type: String,
      required: true,
      enum: ["hourly", "daily"],
    },
    paymentMethod: {
      type: String,
    },
    receipt: {
      type: String,
    },
    notes: {
      type: Schema.Types.Mixed,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

PaymentSchema.index({ userId: 1 });
PaymentSchema.index({ parkingId: 1 });
PaymentSchema.index({ status: 1 });

const Payment = mongoose.model<IPayment>("Payment", PaymentSchema);

export { IPayment, Payment };
