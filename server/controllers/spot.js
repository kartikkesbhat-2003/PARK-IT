const ParkingSpot = require("../models/ParkingSpot");
const Location = require("../models/Location");
const Verification = require("../models/Verification");
const { uploadImageToCloudinary } = require("../utils/imageUploader");
const User = require("../models/User");

// Create a new parking spot
exports.createSpot = async (req, res) => {
    try {
        const {
            longitude,
            lattitude,
            spotLength,
            spotWidth,
            availabilityStatus = "Available",
            pricePerHour
        } = req.body;

        // Validate required fields
        const verificationDoc = req.files.verificationDoc;

        const doc = await uploadImageToCloudinary(verificationDoc, process.env.FOLDER_NAME)

        // Create Location
        const location = `https://www.google.com/maps?q=${lattitude},${longitude}`


        // Create Verification
        const verification = await Verification.create({ verificationDoc : doc.secure_url });

        // Prepare spot size
        const spotSize = `${spotLength}X${spotWidth}`;

        console.log(spotSize)

        // Create ParkingSpot
        const newSpot = await ParkingSpot.create({
            location: location,
            spotSize: spotSize,
            availabilityStatus: availabilityStatus,
            pricePerHour: pricePerHour,
            verification: verification._id
        });

        const userId = req.user.id;
        const user = await User.findByIdAndUpdate(userId, 
            {
                $push: { parkingSpots: newSpot._id },
            },
            {new : true}
        );


        // Populate related fields for response
        const populatedSpot = await ParkingSpot.findById(newSpot._id)
            .populate("location")
            .populate("verification");

        return res.status(201).json({
            success: true,
            message: "Parking spot created successfully",
            data: populatedSpot
        });
    } catch (error) {
        console.log(error)
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
        const { spotId, spotLength, spotWidth, availabilityStatus, pricePerHour } = req.body;

        // Validate Spot ID
        if (!spotId) {
            return res.status(400).json({
                success: false,
                message: "Valid Spot ID is required",
            });
        }

        // Prepare updates
        const updates = {};
        if (spotLength && spotWidth) {
            updates.spotSize = `${spotLength}X${spotWidth}`;
        }
        if (availabilityStatus) {
            updates.availabilityStatus = availabilityStatus;
        }
        if (pricePerHour) {
            updates.pricePerHour = pricePerHour;
        }

        // Update Parking Spot
        const updatedSpot = await ParkingSpot.findByIdAndUpdate(spotId, { $set: updates }, {
            new: true, // Return the updated document
        })
            .populate("location")
            .populate("verification");

        // Check if spot exists
        if (!updatedSpot) {
            return res.status(404).json({
                success: false,
                message: "Parking spot not found",
            });
        }

        // Return success response
        return res.status(200).json({
            success: true,
            message: "Parking spot updated successfully",
            data: updatedSpot,
        });
    } catch (error) {
        // Handle errors
        return res.status(500).json({
            success: false,
            message: "Error updating parking spot",
            error: error.message,
        });
    }
};

// Get all parking spots
exports.getSpots = async (req, res) => {
    try {
        const spots = await ParkingSpot.find()
            .populate("location")
            .populate("verification");

        return res.status(200).json({
            success: true,
            data: spots,
        });
    } catch (error) {
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
        const { spotId } = req.body;

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
        const { spotId } = req.body;

        if (!spotId) {
            return res.status(400).json({
                success: false,
                message: "Spot ID is required",
            });
        }

        // Find and delete the spot by its ID
        const deletedSpot = await ParkingSpot.findByIdAndDelete(spotId);

        const userId = req.user.id;

        const user = await User.findById(userId);
        user.parkingSpots = user.parkingSpots.filter((p) => p._id != spotId)
        await user.save();

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
        return res.status(500).json({
            success: false,
            message: "Error deleting parking spot",
            error: error.message,
        });
    }
};

exports.getSpotsByUser = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).populate("vehicles");
        if (!user) {
            return res.status(400).json({
                success: false,
                message: "User not found"
            });
        }

        const spots = user.parkingSpots;

        if (!spots) {
            return res.status(400).json({
                success: false,
                message: "Spots not found"
            });
        }

        res.status(200).json({
            success: true,
            data: spots
        });

    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Error in getting users spots",
        });
    }
}
