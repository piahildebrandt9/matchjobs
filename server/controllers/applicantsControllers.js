// const  Admins = require('../models/admins')
const  Applicant = require('../models/applicants')
const  JobApplication = require('../models/jobapplication')
const JobOffer = require('../models/joboffer')
const  Recruiter = require('../models/recruiter')
const argon2 = require("argon2"); //https://github.com/ranisalt/node-argon2/wiki/Options
const jwt = require("jsonwebtoken");
const validator = function(email){if(email.match(/^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/)){return true}else{return false}}

const jwt_secret = process.env.JWT_SECRET;

const register = async (req, res) => {
  // this salt can be truly random with one of available npm packages
  const salt = '321dsa'
  const { email, password, password2 } = req.body;
  if (!email || !password || !password2){
    return res.json({ ok: false, message: "All fields required" });
  }
  if (password !== password2){
    return res.json({ ok: false, message: "Passwords must match" });
  }
  if (!validator(email)){
    return res.json({ ok: false, message: "Invalid email" });
  }
  try {
    const user = await Applicant.findOne({ email });
    if (user) return res.json({ ok: false, message: "User exists!" });
    const hash = await argon2.hash(password,salt);
    // not salted, salt is appending a random string to a password to strengthen the hash 
    const hash2 = await argon2.hash(password); 
    // we cna see that hashes for salted and unsalted are different 
    console.log("hash ==>", hash);
    console.log("hash2 ==>", hash2);
    const newUser = {
      email,
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
  const { email, password } = req.body;
  
  if (!email|| !password){
 return res.json({ ok: false, message: "all input fields are required"});
  }
  if (!validator(email)){
    return res.json({ ok: false, message: "Invalid email provided" });
  }

  try {
    const user = await Applicant.findOne({ email});

    if (!user) return res.json({ ok: false, message: "Invalid user provided" });
 
    const match = await argon2.verify(user.password, password);

  
    if (match) {
      // once user is verified and confirmed we send back the token to keep in localStorage in the client and in this token we can add some data -- payload -- to retrieve from the token in the client and see, for example, which user is logged in exactly. The payload would be the first argument in .sign() method. In the following example we are sending an object with key userEmail and the value of email coming from the "user" found in line 47
      const token = jwt.sign({email:user.email, userType:'applicant',_id:user._id}, jwt_secret, { expiresIn: "1000h" }); //{expiresIn:'365d'}
      console.log(token)
      // after we send the payload to the client you can see how to get it in the client's Login component inside handleSubmit function
      res.json({ ok: true, message: "welcome back", token, email });
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
  const {email, password} = req.body;
  try {
      // true if find email
      const findAppName = await Applicant.findOne({email}) // findOne returns the whole object (can use findAppName.password to access key password)
      if (findAppName){
      // CHECK IF PASSWORD MATCHES
     const findPassword = await findAppName.password     //Applicant.findOne({password})
        if (findAppName._id.toString()=== findPassword._id.toString()){
          res.send({ok:true, data:`Applicant ${email} found successfully`})
        } else{
          res.send({ok:false,data:'email and password do not match'})
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
  const {email, password} = req.body; 
  try {
    const findRec = await Applicant.findOne({email, password})
    if (!findRec){

      const createNew = await Applicant.create({email, password})
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
  const {email} = req.body;
  try {
    // find the email
    const findUsername = await Applicant.findOneAndDelete({email})
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
  const {oldEmail,oldPassword,email, password} = req.body
 
  try{
      const findRec = await Applicant.findOne({email:oldEmail,password:oldPassword})
      const findNewRec = await Applicant.findOne({email})

      

      if(findRec){
          if(findNewRec){
              res.send({ok:false,data:`email ${email} already exists`})
          }
          else{
              await Recruiter.updateOne(findRec,{email,password})
              res.send({ok:true,data:`Your email ${oldEmail} has been updated to ${email? email:oldEmail}. Your password ${oldPassword} has been updated to ${password? password:oldPassword}.`})
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
  const {jobApplication} = req.body; 
   
    try {
      
        const newApplication = await JobApplication.create({...jobApplication})
        console.log(newApplication)
        res.send({ok:true,data:newApplication._id.toString()})
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
  const {jobApplication, oldJobApplicationId} = req.body;


  try{
   
      const findjobApplication = await JobApplication.findOne({_id:oldJobApplicationId})
      if (findjobApplication){
        await JobApplication.updateOne(findjobApplication,jobApplication)
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

const getAllJobApplications = async(req,res)=>{
  try {
    const jobApps = await JobApplication.find({});
    if(jobApps){
      res.send({ok:true,data:{jobApps}});
    }
    else{
      res.send({ok:false,data:'failed to load jobApplications'})

    }
    
  } catch (error) {
    res.send({ok:false,data:error})
    
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

const getActiveJobApplication = async(req,res)=>{
  const {userid} = req.params;
  try {
    const activeJobApp = await JobApplication.findOne({active:true,applicantsId:userid})
    if(activeJobApp){
      res.send({ok:true,data:{activeJobApp}})
    }
    else{
      res.send( {ok:false,data:[]})
    }
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
  getAllJobApplications,
  getActiveJobApplication,
}
