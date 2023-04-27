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
    softSkills:[{type:Object,unique:false}],
    hardSkills:[{type:Object,unique:false}],
    jobFields:[{type:Object,unique:false}],
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
    },
    active:{type:Boolean,required:false,unique:false}

},
{strictQuery: false});

module.exports = mongoose.model("jobApplications", jobApplicationSchema);
