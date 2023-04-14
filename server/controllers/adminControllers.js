const  Admins = require('../models/admins')
const  Applicants = require('../models/applicants')
// const  JobApplication = require('../models/jobapplication')
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
        res.send(true)
      } else{
        res.send(false)
      }
    }else{
    res.send("Users doesn't exist :(")
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
      await Admins.create({userName, password})
      res.send('User added')
    } else {
      res.send('User already exists')
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
    const findUsername = await Applicants.findOne({userName})
      if (findUsername){
        await Applicants.deleteOne({userName})
        res.send ('See you in hell !')
      }
  } catch (error) {
    res.send(error)
  }
}

const deleteRecruiter = async (req,res)=>{
  const {userName} = req.body;
  try {
    // find the username
    const findUsername = await Recruiter.findOne({userName})
      if (findUsername){
        await Recruiter.deleteOne({userName})
        res.send ('See you in hell !')
      }else{
        res.send(("user doesn't exist"))
      }
  } catch (error) {
    res.send(error)
  }
}

const deleteOffers = async(req, res)=>{
const {companyName, jobDescription, jobTitle} = req.body;
  try {
    const findOffer = await JobOffer.findOne({companyName, jobDescription})
    if (findOffer){
      await JobOffer.deleteOne({companyName, jobDescription})
      res.send (`Job offer ${jobTitle} has been deleted`)
    } else {
      res.send (`Job offer not found`)
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
  deleteOffers,
  // deleteApplications, 
}