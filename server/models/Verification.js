const mongoose = require("mongoose");

const verificationSchema = new mongoose.Schema({
    verificationStatus: {
        type: String,
    },
    verificationDoc: {
        type: String,
        required: true,
    },
});

module.exports = mongoose.model("Verification", verificationSchema);
