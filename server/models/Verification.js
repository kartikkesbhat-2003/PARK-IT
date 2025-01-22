const mongoose = require("mongoose");

const verificationSchema = new mongoose.Schema({
    verificationStatus: {
        type: String,
        enum: ["Pending", "Verified", "Rejected", ],
        required: true,
        default: "Pending"
    },
    verificationDoc: {
        type: String,
        required: true,
    },
});

module.exports = mongoose.model("Verification", verificationSchema);
