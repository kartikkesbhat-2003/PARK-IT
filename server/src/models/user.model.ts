import mongoose, { Document, Schema } from "mongoose";
import bcrypt from "bcryptjs";

export interface IUser extends Document {
  email: string;
  password: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
  role: "parker" | "owner" | "admin";
  avatar?: string;
  phone?: string;
  userVerification: {
    isVerified: boolean;
    verificationToken?: string;
  };
  isBlocked: boolean;
  isDeleted: boolean;
}

const userSchema = new Schema<IUser>(
  {
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters long"],
    },
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    role: {
      type: String,
      enum: ["parker", "admin", "owner"],
      default: "parker",
    },

    avatar: { type: String },
    phone: { type: String },
    userVerification: {
      isVerified: { type: Boolean, default: true },
      verificationToken: { type: String },
    },
    isBlocked: { type: Boolean, default: false },
    isDeleted: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

export const User = mongoose.model<IUser>("User", userSchema);
