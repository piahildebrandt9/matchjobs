const mongoose = require("mongoose");
const Schema = mongoose.Schema

const jobFieldsSchema = new mongoose.Schema({
    jobFieldName:{type:String,required:true,unique:true},
    softSkills:[{type:String,required:false,unique:false}],
    hardSkills:[{type:String,required:false,unique:false}]
    
},
{strictQuery: false});

module.exports = mongoose.model("jobFields", jobFieldsSchema);
