const ParkingSpot = require("../models/ParkingSpot");
const Location = require("../models/Location");
const Verification = require("../models/Verification");

// Helper function for input validation
const validateFields = (fields) => {
    const missingFields = [];
    for (const [key, value] of Object.entries(fields)) {
        if (!value) missingFields.push(key);
    }
    return missingFields.length ? `Missing fields: ${missingFields.join(", ")}` : null;
};

// Create a new parking spot
exports.createSpot = async (req, res) => {
    try {
        const {
            longitude,
            lattitude,
            spotLength,
            spotWidth,
            availabilityStatus = "Available",
            pricePerHour,
            verificationDoc,
        } = req.body;

        // Validate required fields
        const validationError = validateFields({
            longitude,
            lattitude,
            spotLength,
            spotWidth,
            pricePerHour,
            verificationDoc,
        });
        if (validationError) {
            return res.status(400).json({
                success: false,
                message: validationError,
            });
        }

        // Create Location
        const location = await Location.create({ longitude, lattitude });

        // Create Verification
        const verification = await Verification.create({ verificationDoc });

        // Prepare spot size
        const spotSize = `${spotLength}X${spotWidth}`;

        // Create ParkingSpot
        const newSpot = await ParkingSpot.create({
            location: location._id,
            spotSize,
            availabilityStatus,
            pricePerHour,
            verification: verification._id,
        });

        // Populate related fields for response
        const populatedSpot = await ParkingSpot.findById(newSpot._id)
            .populate("location")
            .populate("verification");

        return res.status(201).json({
            success: true,
            message: "Parking spot created successfully",
            data: populatedSpot,
        });
    } catch (error) {
        console.error("Error creating parking spot:", error);
        return res.status(500).json({
            success: false,
            message: "Error creating parking spot",
            error: error.message,
        });
    }
};

// Update an existing parking spot
exports.updateSpot = async (req, res) => {
    try {
        const { spotId } = req.params;
        const updateData = req.body;

        if (!spotId) {
            return res.status(400).json({
                success: false,
                message: "Spot ID is required",
            });
        }

        const updatedSpot = await ParkingSpot.findByIdAndUpdate(spotId, updateData, {
            new: true, // Return the updated document
        })
            .populate("location")
            .populate("verification");

        if (!updatedSpot) {
            return res.status(404).json({
                success: false,
                message: "Parking spot not found",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Parking spot updated successfully",
            data: updatedSpot,
        });
    } catch (error) {
        console.error("Error updating parking spot:", error);
        return res.status(500).json({
            success: false,
            message: "Error updating parking spot",
            error: error.message,
        });
    }
};

// Get all parking spots
exports.getAllSpots = async (req, res) => {
    try {
        const spots = await ParkingSpot.find()
            .populate("location")
            .populate("verification");

        return res.status(200).json({
            success: true,
            data: spots,
        });
    } catch (error) {
        console.error("Error fetching parking spots:", error);
        return res.status(500).json({
            success: false,
            message: "Error fetching parking spots",
            error: error.message,
        });
    }
};

// Get a specific parking spot by ID
exports.getSpotById = async (req, res) => {
    try {
        const { spotId } = req.params;

        if (!spotId) {
            return res.status(400).json({
                success: false,
                message: "Spot ID is required",
            });
        }

        const spot = await ParkingSpot.findById(spotId)
            .populate("location")
            .populate("verification");

        if (!spot) {
            return res.status(404).json({
                success: false,
                message: "Parking spot not found",
            });
        }

        return res.status(200).json({
            success: true,
            data: spot,
        });
    } catch (error) {
        console.error("Error fetching parking spot:", error);
        return res.status(500).json({
            success: false,
            message: "Error fetching parking spot",
            error: error.message,
        });
    }
};

// Delete a parking spot by ID
exports.deleteSpot = async (req, res) => {
    try {
        const { spotId } = req.params;

        if (!spotId) {
            return res.status(400).json({
                success: false,
                message: "Spot ID is required",
            });
        }

        // Find and delete the spot by its ID
        const deletedSpot = await ParkingSpot.findByIdAndDelete(spotId);

        if (!deletedSpot) {
            return res.status(404).json({
                success: false,
                message: "Parking spot not found",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Parking spot deleted successfully",
            data: deletedSpot,
        });
    } catch (error) {
        console.error("Error deleting parking spot:", error);
        return res.status(500).json({
            success: false,
            message: "Error deleting parking spot",
            error: error.message,
        });
    }
};
