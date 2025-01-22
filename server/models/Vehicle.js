const mongoose = require("mongoose")

const vehicleSchema = new mongoose.Schema({
    vehicleNumber:{
        type:String,
        required:true,
    },
    modalName: {
        type:String,
        required: true,
    },
    vehicleImage: {
        type:String,
        required:true,
    },
    ownwer:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    parkedStatus:{
        type:Boolean
    },
})

module.exports = mongoose.model("Vehicle", vehicleSchema);