const  Admins = require('../models/admins')
const  Applicants = require('../models/applicants')
const  JobApplication = require('../models/jobapplication')
const JobOffer = require('../models/joboffer')
const  Recruiter = require('../models/recruiter')

const findAdmin= async(req, res)=>{
  // the data we get from the login
  const {userName, password} = req.body
  try {
    // true if find username
    const findUserName = await Admins.findOne({userName})
    console.log(findUserName._id)
    if (findUserName){
    // CHECK IF PASSWORD MATCHES
    const findPassword = await Admins.findOne({password})
    console.log(findPassword._id)
      if (findUserName._id.toString()=== findPassword._id.toString()){
        res.send({ok:true, data:'admin found successfully'})
      } else{
        res.send({ok:false,data:'username and password do not match'})
      }
    }else{
    res.send({ok:false, data:"user does not exist"})
    }
  } catch (error) {
    console.log(error)
    res.send(error)
  }
}

const addAdmin = async(req,res)=>{
  const {userName, password} = req.body; 
  try {
    const findAdmin = await Admins.findOne({userName, password})
    if (!findAdmin){

      const createNew = await Admins.create({userName, password})
      if(createNew){
        res.send({ok:true,data:'user added successfully'})
      }
      else{
        res.send({ok:false,data:'failed to add a new admin'})
      }
    } else {
      res.send({ok:false,data:'admin already added'})
    }
  } catch (error) {
    res.send(error)
  }
}

const getAllRecruiters = async (req,res) =>{
  try {
    const allRecruiters = await Recruiter.find({})
    res.send ({allRecruiters})
  } catch (error) {
    res.send(error)
  }
}

const getAllApplicants = async (req,res) =>{
  try {
    const allApplicants = await Applicants.find({})
    res.send ({allApplicants})
  } catch (error) {
    res.send(error)
  }
}

const deleteApplicant = async (req,res)=>{
  const {userName} = req.body;
  try {
    // find the username
    const findUsername = await Applicants.findOneAndDelete({userName})
      if (findUsername){
        // await Applicants.deleteOne({userName})
        res.send ({ok:true,data:'applicant deleted successfully'})
      }
      else{
        res.send({ok:false,data:'failed to find the applicant'})
      }
  } catch (error) {
    res.send(error)
  }
}

const deleteRecruiter = async (req,res)=>{
  const {userName} = req.body;
  try {
    // find the username
    const findUsername = await Recruiter.findOneAndDelete({userName})
      if (findUsername){
        // await Recruiter.deleteOne({userName})
        res.send ({ok:true,data:'recruiter deleted successfully'})
      }else{
        res.send({ok:false,data:'failed to find the recruiter'})
      }
  } catch (error) {
    res.send(error)
  }
}

const deleteOffer = async(req, res)=>{
const { offerId} = req.body;
  try {
    const findOffer = await JobOffer.findOneAndDelete({_id:offerId})
    if (findOffer){
      // await JobOffer.deleteOne({companyName, jobDescription})
      res.send ({ok:true,data:`${findOffer.jobTitle} deleted successfully`})
    } else {
      res.send ({ok:false,data:`failed to find ${findOffer.jobTitle}`})
    }
  } catch (error) {
    
  }
}
const deleteApplication = async(req, res)=>{
  const {userName, jobApplication, jobTitle} = req.body;
    try {
      const findApplication = await JobApplication.findOneAndDelete({userName, jobApplication})
      if (findApplication){
        // await JobApplication.deleteOne({userName, jobApplication})
        res.send ({ok:true,data:` ${jobTitle} deleted successfully`})
      } else {
        res.send ({ok:false,data:`failed to find ${jobTitle}`})
      }
    } catch (error) {
      
    }
  }

module.exports = {
  findAdmin,
  addAdmin,
  getAllRecruiters,
  getAllApplicants,
  deleteApplicant,
  deleteRecruiter,
  deleteOffer,
  deleteApplication, 
}