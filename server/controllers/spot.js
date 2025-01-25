const ParkingSpot = require("../models/ParkingSpot");
const Location = require("../models/Location");
const Verification = require("../models/Verification");
const { uploadImageToCloudinary } = require("../utils/imageUploader");
const User = require("../models/User");

// Function to calculate distance using the Haversine formula
function calculateDistance(lat1, lon1, lat2, lon2) {
    const toRadians = (deg) => (deg * Math.PI) / 180;
    const R = 6371; // Earth's radius in kilometers

    const dLat = toRadians(lat2 - lat1);
    const dLon = toRadians(lon2 - lon1);
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(toRadians(lat1)) *
            Math.cos(toRadians(lat2)) *
            Math.sin(dLon / 2) *
            Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distance in kilometers
}

// Create a new parking spot
exports.createParkingSpot = async (req, res) => {
    try {
        const {
            longitude,
            lattitude,
            addressLine1,
            addressLine2,
            city,
            pincode,
            state,
            country,
            spotLength,
            spotWidth,
            availabilityStatus = "Available",
            pricePerHour
        } = req.body;

        const verificationDoc = req.files.verificationDoc;
        const spotImage = req.files.spotImage;

        const doc = await uploadImageToCloudinary(verificationDoc, process.env.FOLDER_NAME);
        const image = await uploadImageToCloudinary(spotImage, process.env.FOLDER_NAME)

        const location = `https://www.google.com/maps?q=${lattitude},${longitude}`;
        const verification = await Verification.create({ verificationDoc: doc.secure_url });

        const spotSize = `${spotLength}X${spotWidth}`;
        const address = `${addressLine1}, ${addressLine2}, ${city}, ${state} - ${pincode}, ${country}`;

        const newSpot = await ParkingSpot.create({
            location: location,
            address: address,
            spotSize: spotSize,
            availabilityStatus: availabilityStatus,
            pricePerHour: pricePerHour,
            verification: verification._id,
            spotImage: image.secure_url
        });

        const userId = req.user.id;
        await User.findByIdAndUpdate(
            userId,
            { $push: { parkingSpots: newSpot._id } },
            { new: true }
        );

        const populatedSpot = await ParkingSpot.findById(newSpot._id)
            .populate("location")
            .populate("verification");

        return res.status(201).json({
            success: true,
            message: "Parking spot created successfully",
            data: populatedSpot
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Error creating parking spot",
            error: error.message,
        });
    }
};

// Update an existing parking spot
exports.updateParkingSpot = async (req, res) => {
    try {
        const {
            spotLength,
            spotWidth,
            availabilityStatus,
            pricePerHour,
            addressLine1,
            addressLine2,
            city,
            pincode,
            state,
            country
        } = req.body;

        const spotId = req.params.spotId;

        if (!spotId) {
            return res.status(400).json({
                success: false,
                message: "Valid Spot ID is required",
            });
        }

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
        if (addressLine1 && addressLine2 && city && pincode && state && country) {
            updates.address = `${addressLine1}, ${addressLine2}, ${city}, ${state} - ${pincode}, ${country}`;
        }

        const updatedSpot = await ParkingSpot.findByIdAndUpdate(spotId, { $set: updates }, {
            new: true,
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
        return res.status(500).json({
            success: false,
            message: "Error updating parking spot",
            error: error.message,
        });
    }
};

// Get all parking spots
exports.getAllParkingSpots = async (req, res) => {
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
exports.getParkingSpotById = async (req, res) => {
    try {
        const spotId= req.params.spotId;

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
exports.deleteParkingSpot = async (req, res) => {
    try {
        const spotId = req.params.spotId;

        if (!spotId) {
            return res.status(400).json({
                success: false,
                message: "Spot ID is required",
            });
        }

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

// Get parking spots created by a specific user
exports.getParkingSpotsByUser = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).populate("vehicles")
        .populate('parkingSpots');
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
            message: "Error in getting user's spots",
        });
    }
};

// Controller function for getting nearby parking spots
exports.getNearbyParkingSpots = async (req, res) => {
    try {
        const { currentLat, currentLong} = req.body;

        if (!currentLat || !currentLong) {
            return res.status(400).json({
                success: false,
                message: "Latitude and longitude are required in the request body"
            });
        }

        const spots = await ParkingSpot.find(); // Assume ParkingSpot is your MongoDB model

        // Filter spots within 5 km of user
        const nearbySpots = spots.filter((spot) => {
            const coordinates = spot.location.match(/q=(-?\d+\.\d+),(-?\d+\.\d+)/);

 
                const latitude = coordinates[1];  // First capturing group is latitude
                const longitude = coordinates[2]; // Second capturing group is longitude
                const distance = calculateDistance(
                parseFloat(latitude),
                parseFloat(longitude),
                parseFloat(currentLat),
                parseFloat(currentLong)
            );
            return distance <= 5;
        });
        
        return res.status(200).json({
            success: true,
            data: nearbySpots
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Error fetching nearby spots",
            error: error.message,
        });
    }
};

