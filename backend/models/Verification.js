const mongoose = require("mongoose")


exports.verificationSchema = new mongoose.Schema({
    verificationStatus:{
        type:String,
        enum:["Verified", "Pending", "Regected"],
        default: "Pending"
    },
    verificationDoc: {
        type:String,
        required:true
    }
})

module.exports = mongoose.model("Verificatcion", verificationSchema);