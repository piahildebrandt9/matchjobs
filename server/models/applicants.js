const mongoose = require("mongoose");

const applicantsSchema = new mongoose.Schema({
userName: {type:String , required:true, unique:true},
password: {type:String, required:true,unique:false},


});

module.exports = mongoose.model("applicants", applicantsSchema);
