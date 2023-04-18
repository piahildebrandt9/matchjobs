const  JobApplication = require('../models/jobapplication')
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
        const findPassword = await findRecName.password
          if (findRecName._id.toString()=== findPassword._id.toString()){
            res.send({ok:true, data:`recruiter ${userName} found successfully`})
          } else{
            res.send({ok:false,data:'username and password do not match'})
          }
        }else{
        res.send({ok:false, data:"user does not exist"})
        }
      } catch (error) {
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
        console.log(newOffer)
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

// //updateJobOffer
// router.post('updateJobOffer',controller.updateJobOffer)
const updateJobOffer = async (req,res)=>{
  const {jobOffer, oldJobOffer} = req.body; 
  try{
      const findjobOffer = await JobOffer.findOne(oldJobOffer)
      if (findjobOffer){
        await JobOffer.updateOne(findjobOffer,{jobOffer})
        res.send({ok:true, data:`Job offer updated successfully`})
      } else{
        res.send({ok:false, data:`Job offer not found`})
      }
         }catch(error){
      res.send(error)
  }
}

// //getAllMyJobOffer
const getAllMyJobOffer = async(req,res)=>{
  let {id} = req.params;
  try {
    // empty array with objects of all the job offers that belongs to this recruiter
    // var arrJobOffer =[]
    const allJobOffers = await JobOffer.find({recruiterId: id}) // FIND ALL
    res.send({ok:true, data: allJobOffers})
  //     for (var ele of allJobOffers){
  //     if (ele._id.toString() == recruiterId.toString()){ // take the job offers of a specific id(user)
  //       arrJobOffer.push(ele)
  //     }else {
  //     }} res.send({ok:true, data: arrJobOffer})    
  } catch (error) {
    res.send(error)
  }
}
// //likeApplicant
const likeApplicant = async(req,res)=>{
  const {applicationId, recruiterId}= req.body

  try {
    const offer = await JobApplication.findOneAndUpdate({_id: applicationId}, {$push: {likedBy: {recruiter_id : recruiterId}}}) // FIND ALL
      // if(application){
      //   application.likedBy.push({recruiterId})
      //   res.send({ok:true, data:' Applicant liked successfully'})    
      // }else{
      //   res.send({ok:true, data:"Applicant id could'nt be found"})    
      // }
   } catch (error) {
    res.send(error)
  }
}



// unlikeApplicant
const unlikeApplicant = async(req,res)=>{
  const {applicationId, recruiterId}= req.body
  try {
    const application = await JobApplication.findOneAndUpdate({_id: applicationId}, {$pull: {likedBy: {recruiter_id : recruiterId}}}) // FIND ALL
  //     if(application){
  //       // findIndex find the id
  //      const findIndexApplication = application.likedBy.findIndex(c=>c.toString()== recruiterId.toString())
  //         if (!findIndexApplication==-1){
  //           application.likedBy.splice(findIndexApplication, 1) // remove the index found (1)
  //           res.send({ok:true, data:' Applicant unliked successfully'})    
  //         }else{
  //       res.send({ok:true, data:"Applicant id could'nt be found"})    
  //  }}else{
  //   res.send({ok:true, data:"Applicant could'nt be found"})    
  //  }
} catch (error) {
    res.send(error)
  }
}
module.exports = {
    findRecruiter,
    addRecruiter,
    deleteRecruiter,
    updateRecruiter,
    addJobOffer,
    deleteJobOffer,
    updateJobOffer,
    getAllMyJobOffer,
    likeApplicant,
    unlikeApplicant,
  }
