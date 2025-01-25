const mongoose = require("mongoose");

const parkingSpotSchema = new mongoose.Schema({
    location: {
        type: String,
        required: true, // Ensure location is required
    },
    spotSize: {
        type: String,
        required: true,
    },
    spotImage: {
        type: String
    },
    availabilityStatus: {
        type: String,
        enum: ["Available", "Occupied", "Inactive"], // Predefined values
        default: "Available",
    },
    pricePerHour: {
        type: Number,
        required: true, // Price per hour is required
    },
    verification: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Verification", // Reference to the Verification model
        required: true,
    },
    spotImage: {
        type: String,
    },
    address: {
        type:String,
    }
}, {
    timestamps: true, // Adds createdAt and updatedAt fields
});

// Export the model
module.exports = mongoose.model("ParkingSpot", parkingSpotSchema);
