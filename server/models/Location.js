const mongoose = require("mongoose")

const locationSchema = new mongoose.Schema({
    longitude:{
        type:String,
        required:true
    },
    lattitude:{
        type:String,
        required:true
    }
})

module.exports = mongoose.model("Location", locationSchema)