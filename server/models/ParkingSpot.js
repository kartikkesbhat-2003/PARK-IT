const mongoose = require("mongoose")

const spotSchema = new mongoose.Schema({
    location:{
        type:mongoose.Schema.Types.ObjectId,
        ref: "Location"
    },
    spotSize: {
        type:Number,
        required: true
    },
    avalabilityStatus:{
        type:String,
        enum:["Available", "Occupied", "Inactive"],
        default: "Available"
    },
    pricePerHour: {
        type:Number
    },
    verification: {
        type:mongoose.Schema.Types.ObjectId,
        ref:"Verification"
    },
    bookings: [
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"Booking"
        }
    ]
})

module.exports = mongoose.model("ParkingSpot", spotSchema);