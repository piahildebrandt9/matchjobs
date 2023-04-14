const mongoose = require("mongoose");

const jobOfferSchema = new mongoose.Schema({

    jobTitle: {type:String,required:false,unique:false},
    remote:{type:Boolean,required:true,unique:false},
    onSite:{type:Boolean,required:true,unique:false},
    flexible:{type:Boolean,required:true,unique:false},
    minPrice:{type:Number,required:false,unique:false},
    maxPrice:{type:Number,required:false,unique:false},
    location:{type:String,required:false,unique:false},
    bio:{type:String,required:false,unique:false},
    softSkills:{type:String,required:true,unique:false},
    hardSkills:{type:String,required:true,unique:false},
    jobFields:{type:String,required:true,unique:false},
    

    
// userName: {type:String , required:true, unique:true},
// password: {type:String, required:true,unique:false},
// jobOffers:{type:String, required:false,unique:true},


//   name: { type: String, required: true, unique: true },
//   price: { type: Number, required: true },
//   color: { type: String, required: true },
//   description: { type: String, required: true },
//   category: { type: String, required: true, unique: false },
});

module.exports = mongoose.model("jobOffer", jobOfferSchema);
