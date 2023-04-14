const mongoose = require("mongoose");

const jobOfferSchema = new mongoose.Schema({
    companyName:{type:String,required:true,unique:false},
    jobTitle: {type:String,required:false,unique:false},
    remote:{type:Boolean,required:true,unique:false},
    onSite:{type:Boolean,required:true,unique:false},
    flexible:{type:Boolean,unique:false},
    minPrice:{type:Number,unique:false},
    maxPrice:{type:Number,unique:false},
    location:{type:String,unique:false},
    jobDescription:{type:String,unique:false},
    softSkills:[{type:String,required:true,unique:false}],
    hardSkills:[{type:String,required:true,unique:false}],
    jobFields:[{type:String,required:true,unique:false}],
    likedBy:[{
        _id:Schema.Types.ObjectId,
        ref:'applicants',

    }],
    recruitersId:{
        _id: Schema.Types.ObjectId,
        required:true,
        ref:'recruiter',
    }
  
});

module.exports = mongoose.model("jobOffer", jobOfferSchema);
