const mongoose = require("mongoose")

const notificationSchema = new mongoose.Schema({
    meassage:{
        type:String,
        required:true,
    },
    sendAt:{
        type:Date,
        default:Date.now,
        expires:5*60,
    }
})

module.exports = mongoose.model("Notification", notificationSchema);