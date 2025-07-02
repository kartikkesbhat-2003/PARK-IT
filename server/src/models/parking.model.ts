import mongoose, { Document, Schema, Model } from "mongoose";

// Define interface for the Parking document
interface IParking extends Document {
  name: string;
  address: string;
  hourlyRate: number;
  dailyRate: number;
  rating: number;
  totalReviews: number;
  availableSpots: number;
  vehicleTypes: string[];
  features: string[];
  imageUrl: string;
  coordinates: {
    type: string;
    coordinates: [number, number]; // [lng, lat] for GeoJSON format
  };
  owner: mongoose.Types.ObjectId;
  isActive: boolean;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Add static methods to interface
interface IParkingModel extends Model<IParking> {
  findNearby(
    latitude: number,
    longitude: number,
    maxDistance?: number
  ): Promise<IParking[]>;
}

const ParkingSchema = new Schema<IParking>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    address: {
      type: String,
      required: true,
      trim: true,
    },
    hourlyRate: {
      type: Number,
      required: true,
      min: 0,
    },
    dailyRate: {
      type: Number,
      required: true,
      min: 0,
    },
    rating: {
      type: Number,
      required: true,
      min: 0,
      max: 5,
      default: 0,
    },
    totalReviews: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
    },
    availableSpots: {
      type: Number,
      required: true,
      min: 0,
    },
    vehicleTypes: {
      type: [String],
      required: true,
      enum: ["car", "motorcycle", "bus", "truck", "bicycle", "suv", "ev"],
    },
    features: {
      type: [String],
      required: true,
      enum: ["covered", "security", "cctv", "ev_charging", "handicap", "valet"],
    },
    imageUrl: {
      type: String,
      required: true,
    },
    coordinates: {
      type: {
        type: String,
        enum: ["Point"],
        required: true,
        default: "Point",
      },
      coordinates: {
        type: [Number], // [longitude, latitude] - GeoJSON format
        required: true,
        validate: {
          validator: function (array: number[]) {
            return (
              array.length === 2 &&
              array[0] >= -180 &&
              array[0] <= 180 && // longitude
              array[1] >= -90 &&
              array[1] <= 90
            ); // latitude
          },
          message: "Coordinates must be valid [longitude, latitude] pairs",
        },
      },
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// 🔍 Indexes
ParkingSchema.index({ name: "text", address: "text" });
ParkingSchema.index({ hourlyRate: 1 });
ParkingSchema.index({ availableSpots: 1 });
ParkingSchema.index({ rating: -1 });
ParkingSchema.index({ coordinates: "2dsphere" }); // ✅ Required for geo queries

// 📍 Static method for nearby search
ParkingSchema.statics.findNearby = function (
  latitude: number,
  longitude: number,
  maxDistance: number = 5000
) {
  return this.find({
    coordinates: {
      $near: {
        $geometry: {
          type: "Point",
          coordinates: [longitude, latitude], // GeoJSON uses [lng, lat]
        },
        $maxDistance: maxDistance,
      },
    },
    isActive: true,
    isDeleted: false,
  });
};

// Use a singleton pattern to prevent model recompilation
let Parking: IParkingModel;

try {
  // Try to retrieve the existing model first
  Parking = mongoose.model<IParking, IParkingModel>("Parking");
} catch (error) {
  // If the model doesn't exist yet, create it
  Parking = mongoose.model<IParking, IParkingModel>("Parking", ParkingSchema);
}

export { IParking, IParkingModel, Parking };
