const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid"); // To generate unique IDs

const parkingSpotSchema = new mongoose.Schema({
    spotId: {
        type: String,
        unique: true, // Ensure uniqueness of spotId
        default: () => uuidv4(), // Generate a unique ID automatically
    },
    location: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Location", // Reference to the Location model
        required: true, // Ensure location is required
    },
    spotSize: {
        type: String,
        required: true, // Spot size is required
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
}, {
    timestamps: true, // Adds createdAt and updatedAt fields
});

// Export the model
module.exports = mongoose.model("ParkingSpot", parkingSpotSchema);
