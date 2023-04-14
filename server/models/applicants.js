const mongoose = require("mongoose");

const applicantsSchema = new mongoose.Schema({
userName: {type:String , required:true, unique:true},
password: {type:String, required:true,unique:false},
jobApplication:{type:String, required:false,unique:true},


//   name: { type: String, required: true, unique: true },
//   price: { type: Number, required: true },
//   color: { type: String, required: true },
//   description: { type: String, required: true },
//   category: { type: String, required: true, unique: false },
});

module.exports = mongoose.model("applicants", applicantsSchema);
