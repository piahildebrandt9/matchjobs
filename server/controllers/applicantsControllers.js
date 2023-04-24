// const  Admins = require('../models/admins')
const  Applicant = require('../models/applicants')
const  JobApplication = require('../models/jobapplication')
const JobOffer = require('../models/joboffer')
const  Recruiter = require('../models/recruiter')
const argon2 = require("argon2"); //https://github.com/ranisalt/node-argon2/wiki/Options
const jwt = require("jsonwebtoken");

const jwt_secret = process.env.JWT_SECRET;

const register = async (req, res) => {
  // this salt can be truly random with one of available npm packages
  const salt = '321dsa'
  const { userName, password, password2 } = req.body;
  if (!userName || !password || !password2){
    return res.json({ ok: false, message: "All fields required" });
  }
  if (password !== password2){
    return res.json({ ok: false, message: "Passwords must match" });
  }
  // if (!validator.isEmail(email)){
  //   return res.json({ ok: false, message: "Invalid email" });
  // }
  try {
    const user = await Applicant.findOne({ userName });
    if (user) return res.json({ ok: false, message: "Admin exists!" });
    const hash = await argon2.hash(password,salt);
    // not salted, salt is appending a random string to a password to strengthen the hash 
    const hash2 = await argon2.hash(password); 
    // we cna see that hashes for salted and unsalted are different 
    console.log("hash ==>", hash);
    console.log("hash2 ==>", hash2);
    const newUser = {
      userName,
      password: hash,
    };
    await Applicant.create(newUser);
    res.json({ ok: true, message: "Successfully registered" });
  } catch (error) {
    console.log(error)
    res.json({ ok: false, error });
  }
};

const login = async (req, res) => {
  const { userName, password } = req.body;
  if (!userName || !password){
    return res.json({ ok: false, message: "All fields are required" });
  }
  // if (!validator.isEmail(email)){
  //   return res.json({ ok: false, message: "Invalid email provided" });
  // }
  try {
    const user = await Applicant.findOne({ userName });
    if (!user) return res.json({ ok: false, message: "Invalid admin provided" });
    const match = await argon2.verify(user.password, password);
    if (match) {
      // once user is verified and confirmed we send back the token to keep in localStorage in the client and in this token we can add some data -- payload -- to retrieve from the token in the client and see, for example, which user is logged in exactly. The payload would be the first argument in .sign() method. In the following example we are sending an object with key userEmail and the value of email coming from the "user" found in line 47
      const token = jwt.sign({userName:user.userName, userType:"applicant",_id:user._id}, jwt_secret, { expiresIn: "10000h" }); //{expiresIn:'365d'}
      // after we send the payload to the client you can see how to get it in the client's Login component inside handleSubmit function
      res.json({ ok: true, message: "welcome back", token, userName });
    } else return res.json({ ok: false, message: "Invalid data provided" });
  } catch (error) {
    res.json({ ok: false, error });
  }
};

const verify_token = (req, res) => {
  console.log(req.headers.authorization);
  const token = req.headers.authorization;
  jwt.verify(token, jwt_secret, (err, succ) => {
    err
      ? res.json({ ok: false, message: "Token is corrupted" })
      : res.json({ ok: true, succ });
  });
};

// //findApplicants
const findApplicants = async (req,res) =>{
  const {userName, password} = req.body;
  try {
      // true if find username
      const findAppName = await Applicant.findOne({userName}) // findOne returns the whole object (can use findAppName.password to access key password)
      if (findAppName){
      // CHECK IF PASSWORD MATCHES
     const findPassword = await findAppName.password     //Applicant.findOne({password})
        if (findAppName._id.toString()=== findPassword._id.toString()){
          res.send({ok:true, data:`Applicant ${userName} found successfully`})
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
// //addApplicants
const addApplicants = async (req,res) =>{
  const {userName, password} = req.body; 
  try {
    const findRec = await Applicant.findOne({userName, password})
    if (!findRec){

      const createNew = await Applicant.create({userName, password})
      if(createNew){
        res.send({ok:true,data:'User added successfully'})
      }
      else{
        res.send({ok:false,data:'failed to add a new user'})
      }
    } else {
      res.send({ok:false,data:'user already exists'})
    }
  } catch (error) {
    res.send(error)
  }
}

// //deleteApplicants
const deleteApplicant = async (req,res)=>{
  const {userName} = req.body;
  try {
    // find the username
    const findUsername = await Applicant.findOneAndDelete({userName})
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

// //updateApplicants
const updateApplicant = async (req,res)=>{
  const {olduserName,oldPassword,userName, password} = req.body
 
  try{
      const findRec = await Applicant.findOne({userName:olduserName,password:oldPassword})
      const findNewRec = await Applicant.findOne({userName})

      

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

// //addApplication,
const addApplication = async (req,res) =>{
  const {jobTitle, remote,onSite, flexible,minPrice,maxPrice,location,bio,softSkills,hardSkills, jobFields,uploadedFiles, userName } = req.body; 
  try {
   const applicant = await Applicant.findOne({userName})
   if(applicant){
      const newApplication = await JobApplication.create({jobTitle, remote,onSite, flexible,minPrice,maxPrice,location,bio,softSkills,hardSkills, jobFields,uploadedFiles,likedBy :[], applicantsId: applicant._id })
      console.log(newApplication)
      res.send({ok:true,data:'new job application created successfully'})
   }else{
      res.send({ok:false,data:'could not find the current user'})
   } 
  } catch (error) {
    res.send(error)
  }

}

// //deleteApplication
const deleteApplication = async (req,res)=>{
  const {applicationId} = req.body;
  try {
      const findApp = await JobApplication.findOneAndDelete({_id:applicationId})
      if (findApp){
      res.send ({ok:true,data:`${findApp.jobTitle} deleted successfully`})
      } else {
      res.send ({ok:false,data:`failed to find ${findApp.jobTitle}`})
      }
  } catch (error) {
    res.send(error) 
}
}

// //updateJobApplication
const updateJobApplication = async (req,res)=>{
  const {jobApp, oldJobApp} = req.body; 
  try{
      const findjobApp = await JobApplication.findOne(oldJobApp)
      if (findjobApp){
        await JobApplication.updateOne(findjobApp,{jobApp})
        res.send({ok:true, data:`Job application updated successfully`})
      } else{
        res.send({ok:false, data:`Job application not found`})
      }
         }catch(error){
      res.send(error)
  }
}


const getJobApplication = async(req,res)=>{
  // this id = id of one job application
  let {id} = req.params;
    try {
      const jobApp = await JobApplication.findOne({_id: id})
      if (jobApp){
        res.send({ok: true, data: {jobApp}})
      }else{
        res.send ({ok: false, data: "Job application doesn't exist"})
      }
     
    } catch (error) {
      res.send(error)
    }
}





// // getAllMyJobApplications
const getAllMyJobApplications = async(req,res)=>{

// look for records in JobApplications collection with specific applicantsId reference
// pass to the controller a current applicant_id
let {id} = req.params;
  // const {applicantId}= req.body

  try {
    // empty array with objects of all the job offers that belongs to this recruiter
    // var arrJobApplications =[]
    const allJobApplications = await JobApplication.find({applicantsId: id}) // FIND ALL
    res.send({ok:true, data: allJobApplications})
  //     for (var ele of allJobApplications){
  //     if (ele._id.toString() == applicantId.toString()){ // take the job offers of a specific id(user)
  //       arrJobApplications.push(ele)
  //     }else {
  //     }}
  //  res.send({ok:true, data: arrJobApplications})    
  } catch (error) {
    res.send(error)
  }
}


// // //likeJobOffer
const likeOffer = async(req,res)=>{
  const {offerId, applicantId}= req.body

  try {
    const offer = await JobOffer.findOneAndUpdate({_id: offerId}, {$push: {likedBy: {applicant_id : applicantId}}}) // FIND ALL
      // if(offer){
      //   offer.likedBy.push(applicantId)
      //   res.send({ok:true, data:' Offer liked successfully'})    
      // }else{
      //   res.send({ok:true, data:"Offer id could'nt be found"})    
      // }
   } catch (error) {
    res.send(error)
  }
}

// // //unlikeJobOffer
const unlikeOffer = async(req,res)=>{
  const {offerId, applicantId}= req.body
  try {
    const offer = await JobOffer.findOneandUpdate({_id: offerId}, {$pull: {likedBy: {applicant_id : applicantId}}}) // FIND ALL

  //     if(offer){
  //       // findIndex find the id
  //      const findIndexOffer= offer.likedBy.findIndex(c=>c.toString()== applicantId.toString())
  //         if (!findIndexOffer==-1){
  //           offer.likedBy.splice(findIndexOffer, 1) // remove the index found (1)
  //           res.send({ok:true, data:' Offer unliked successfully'})    
  //         }else{
  //       res.send({ok:true, data:"Offer id could'nt be found"})    
  //  }}else{
  //   res.send({ok:true, data:"Offer could'nt be found"})    
  } catch (error) {
    res.send(error)
  }
}







module.exports = {
  findApplicants,
  addApplicants,
  deleteApplicant,
  updateApplicant,
  addApplication,
  deleteApplication,
  updateJobApplication,
  getAllMyJobApplications,
  likeOffer,
  unlikeOffer,
  login,
  register,
  verify_token,
  getJobApplication,
}
