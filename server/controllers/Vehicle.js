const Vehicle = require("../models/Vehicle");
const User = require("../models/User");
const { uploadImageToCloudinary } = require("../utils/imageUploader");
require("dotenv").config();


exports.createVehicle = async (req, res) => {
    try {

        // fetch data
        let {
            vehicleNumber, 
            modalName, 
        } = req.body;

        // fetch thumbnail image
        const vehicleImage = req.files.vehicleImage; 

        // validation 
        if(!vehicleNumber || 
            !modalName ||
            !vehicleImage
        ) {
            return res.status(400).json({
                success:false,
                message:"All feilds required"
            })
        }        
        
        // check for instructor
        const userId = req.user.id;
        const userDetails = await User.findById(userId, {
            accountType: "User",
        });;
        console.log("User details", userDetails);

        if(!userDetails) {
            return res.status(404).json({
                success:false,
                message:"User not found"
            })
        }

        // upload image to cloudinary
        const vehicleImg = await uploadImageToCloudinary(vehicleImage, process.env.FOLDER_NAME);

        const newVehicle = await Vehicle.create(
            {
                vehicleNumber,
                modalName,
                vehicleImage:vehicleImg.secure_url,
                ownwer:userDetails._id,
            }
        )

        // add the new course to the user schema of instructor
        await User.findByIdAndUpdate(
            {_id:userDetails._id},
            {$push: {vehicles:newVehicle._id}},
            {new:true}
        )

        res.status(200).json({
            success: true,
            data: newVehicle,
            message: "Vehicle Created Successfully",
        });


    } catch(err) {
        return res.status(500).json(
            {
                success:false,
                message:"Failed to create Vehicle",
                error:err.message,
            }
        )
    }
}

// get all vehicles
exports.getVehicles = async (req, res) => {
    try {
        const allVehicles = await Vehicle.find({},
            {
                vehicleNumber: true,
                modalName: true,
                vehicleImage: true,
            });

        if (!allVehicles) {
            return res.status(400).json({
                success: false,
                message: "Vehicles not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Data for all vehicles fetched successfully",
            data: allVehicles
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error in getting vehicles",
        });
    }
}

// get vehicle of a user
exports.getVehiclesByUser = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).populate("vehicles");
        if (!user) {
            return res.status(400).json({
                success: false,
                message: "User not found"
            });
        }

        const vehicles = user.vehicles;

        if (!vehicles) {
            return res.status(400).json({
                success: false,
                message: "Vehicles not found"
            });
        }

        res.status(200).json({
            success: true,
            data: vehicles
        });

    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Error in getting users vehicles",
        });
    }
}

// get vehicle by id
exports.getVehicleDetails = async (req, res) => {
    try {
        const { vehicleId } = req.body;

        if (!vehicleId) {
            return res.status(400).json({
                success: false,
                message: "Please provide vehicle id"
            });
        }

        const vehicle = await Vehicle.find({_id:vehicleId})

        if (!vehicle) {
            return res.status(400).json({
                success: false,
                message: "Vehicle not found"
            });
        }

        res.status(200).json({
            success: true,
            data: vehicle
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error in getting vehicle",
        });
    }
}


// delete vehicle
exports.deleteVehicle = async (req, res) => {
    try {
        const { vehicleId } = req.body;

        if (!vehicleId) {
            return res.status(400).json({
                success: false,
                message: "Please provide vehicle id"
            });
        }

        const user = await User.findById(req.user.id).populate("vehicles");
        if (!user) {
            return res.status(400).json({
                success: false,
                message: "User not found"
            });
        }

        const vehicle = await Vehicle.findByIdAndDelete(vehicleId);

        if (!vehicle) {
            return res.status(400).json({
                success: false,
                message: "Vehicle not found"
            });
        }

        user.vehicles = user.vehicles.filter((v) => v._id != vehicleId);
        await user.save();

        res.status(200).json({
            success: true,
            message: "Vehicle deleted successfully",
            data: user
        });

    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Error in deleting vehicle",
        });
    }
}


