const mongoose = require("mongoose");
const Schema = mongoose.Schema

const jobApplicationSchema = new mongoose.Schema({

    jobTitle: {type:String,unique:false},
    remote:{type:Boolean,required:true,unique:false},
    onSite:{type:Boolean,required:true,unique:false},
    flexible:{type:Boolean,required:true,unique:false},
    minPrice:{type:Number,unique:false},
    maxPrice:{type:Number,unique:false},
    location:{type:String,unique:false},
    bio:{type:String,unique:false},
    softSkills:[{type:String,unique:false}],
    hardSkills:[{type:String,unique:false}],
    jobFields:[{type:String,unique:false}],
    uploadedFiles:[{type:String,unique:false}],
    likedBy: [{
        recruiter_id: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'applicants'
        }}],
    applicantsId:{
        type: Schema.Types.ObjectId,
        required: true,
        ref:'applicants',
    }

});

module.exports = mongoose.model("jobApplications", jobApplicationSchema);
