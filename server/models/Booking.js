const mongoose = require("mongoose")

exports.bookingSchema = new mongoose.Schema({
    startTime:{
        type:Date,
        default:Date.now,
    },
    endTime: {
        type: Date
    },
    totalAmount: {
        type:Number
    },
    paymentType: {
        type:String,
        enum:["Online", "Cash"],
        default:"Online"
    },
    payment: {
        type:mongoose.Schema.Types.ObjectId,
        ref:"Payment"
    },
    vehicle: {
        type:mongoose.Schema.Types.ObjectId,
        ref:"Vehicle"
    },

})

module.exports = mongoose.model("Booking", bookingSchema);