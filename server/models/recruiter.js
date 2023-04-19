const mongoose = require("mongoose");

const recruiterSchema = new mongoose.Schema({
userName: {type:String , required:true, unique:true},
password: {type:String, required:true,unique:false},
},
{strictQuery: false});

module.exports = mongoose.model('recruiters', recruiterSchema);


