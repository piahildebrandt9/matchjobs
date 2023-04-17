// const  Admins = require('../models/admins')
// const  Applicants = require('../models/applicants')
// const  JobApplication = require('../models/jobapplication')
const JobOffer = require('../models/joboffer')
const  Recruiter = require('../models/recruiter')


const findRecruiter = async (req,res) =>{
    const {userName, password} = req.body;
    try {
        // true if find username
        const findRecName = await Recruiter.findOne({userName})
        console.log(findRecName._id)
        if (findRecName){
        // CHECK IF PASSWORD MATCHES
        const findPassword = await Recruiter.findOne({password})
        console.log(findPassword._id)
          if (findRecName._id.toString()=== findPassword._id.toString()){
            res.send({ok:true, data:`recruiter ${userName} found successfully`})
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
const addRecruiter = async (req,res) =>{
    const {userName, password} = req.body; 
    try {
      const findRec = await Recruiter.findOne({userName, password})
      if (!findRec){
  
        const createNew = await Recruiter.create({userName, password})
        if(createNew){
          res.send({ok:true,data:'recruiter added successfully'})
        }
        else{
          res.send({ok:false,data:'failed to add a new recruiter'})
        }
      } else {
        res.send({ok:false,data:'recruiter already exists'})
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
          res.send ({ok:true,data:'your profile has been deleted successfully'})
        }else{
          res.send({ok:false,data:'failed to find you'})
        }
    } catch (error) {
      res.send(error)
    }
}
const updateRecruiter = async (req,res)=>{
    const {olduserName,oldPassword,userName, password} = req.body
    try{
        const findRec = await Recruiter.findOne({userName:olduserName,password:oldPassword})
        const findNewRec = await Recruiter.findOne({userName})

        if(findRec){
            if(findNewRec){
                res.send({ok:false,data:`username ${userName} already exists`})
            }
            else{
                await Recruiter.updateOne(findRec,{userName,password})
                res.send({ok:true,data:`Your username ${olduserName} has been updated to ${userName? userName:olduserName}. Your password ${oldPassword} has been updated to ${password? password:oldPassword}.`})
            }
        }
        else{
            res.send({ok:false,data:'could not find the user'})
        }
    }catch(error){
        res.send(error)
    }

}

const addJobOffer = async (req,res) =>{
    const {companyName,  jobTitle, remote, onSite, flexible, minPrice, maxPrice,location, jobDescription, softSkills, hardSkills,jobFields,userName} = req.body; 
    try {
     const recruiter = await Recruiter.findOne({userName})
     console.log(recruiter)
     if(recruiter){
        const newOffer = await JobOffer.create({companyName,jobTitle,remote,onSite,flexible,minPrice,maxPrice,location,jobDescription,softSkills,hardSkills,jobFields, likedBy :[], recruitersId:recruiter._id})
        res.send({ok:true,data:'new job offer created successfully'})
     }else{
        res.send({ok:false,data:'could not find the current user'})
     } 
    } catch (error) {
      res.send(error)
    }

}

const deleteJobOffer = async (req,res)=>{
    const {offersId} = req.body;
    try {
        const findOffer = await JobOffer.findOneAndDelete({_id:offersId})
        if (findOffer){
        // await JobOffer.deleteOne({companyName, jobDescription})
        res.send ({ok:true,data:`${findOffer.jobTitle} deleted successfully`})
        } else {
        res.send ({ok:false,data:`failed to find ${findOffer.jobTitle}`})
        }
    } catch (error) {
        res.send(error)
        
  }

}
// //deleteJobOffer
// router.post('/deleteJobOffer',controller.deleteJobOffer)
// //updateJobOffer
// router.post('updateJobOffer',controller.updateJobOffer)
// //getAllMyJobOffer
// router.get('/getAllMyJobOffers',controller.getAllMyJobOffers)
// //likeApplicant
// router.post('/likeApplicant',controller.LikeApplicant)
// //unlikeApplicant
// router.post('/unlikeApplicant',controller.unlikeApplicant)

module.exports = {
    findRecruiter,
    addRecruiter,
    deleteRecruiter,
    updateRecruiter,
    addJobOffer,
    deleteJobOffer,
    
  }

