const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
   name: {
    type: String,
    require:true,
    unique: true
   },
   lname:{
    type:String,
    require:true,
    unique:true
   },
   email: {
    type: String,
    require: true,
    unique: true
   },
   password:{
    type: String,
    required: true,
    unique: true
   }
}, {timestamps: true});

module.exports = mongoose.model("User", userSchema);