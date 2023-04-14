const mongoose = require("mongoose");

const jobApplicationSchema = new mongoose.Schema({

    jobTitle: {type:String,required:false,unique:false},
    remote:{type:Boolean,required:true,unique:false},
    onSite:{type:Boolean,required:true,unique:false},
    flexible:{type:Boolean,required:true,unique:false},
    minPrice:{type:Number,required:false,unique:false},
    maxPrice:{type:Number,required:false,unique:false},
    location:{type:String,required:false,unique:false},
    bio:{type:String,required:false,unique:false},
    softSkills:[{type:String,required:false,unique:false}],
    hardSkills:[{type:String,required:false,unique:false}],
    jobFields:[{type:String,required:false,unique:false}],
    uploadedFiles:[{type:String,required:false,unique:false}],
    likedBy:[{
        _id:Schema.Types.ObjectId,
        required:false,
        ref:'recruiter',

    }],
    applicantsId:{
        _id: Schema.Types.ObjectId,
        required:false,
        ref:'applicants',
    }

});

module.exports = mongoose.model("jobApplication", jobApplicationSchema);
