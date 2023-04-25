const  Admins = require('../models/admins')
const  Applicants = require('../models/applicants')
const  JobApplication = require('../models/jobapplication')
const JobOffer = require('../models/joboffer')
const  Recruiter = require('../models/recruiter')
const jobField = require('../models/jobFields');
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
    const user = await Admins.findOne({ userName });
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
    await Admins.create(newUser);
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
    const user = await Admins.findOne({ userName });
    if (!user) return res.json({ ok: false, message: "Invalid admin provided" });
    const match = await argon2.verify(user.password, password);
    if (match) {
      // once user is verified and confirmed we send back the token to keep in localStorage in the client and in this token we can add some data -- payload -- to retrieve from the token in the client and see, for example, which user is logged in exactly. The payload would be the first argument in .sign() method. In the following example we are sending an object with key userEmail and the value of email coming from the "user" found in line 47
      const token = jwt.sign({userName:user.userName, userType: 'admin', _id:user._id}, jwt_secret, { expiresIn: "100000h" }); //{expiresIn:'365d'}
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
  

  const addJobField = async(req,res)=>{
    const {jobFieldName} = req.body;

    try {
      const newJobField = await jobField.create({jobFieldName,hardSkills:[],softSkills:[]})
      if(newJobField){
        res.send({ok:true,data:'successfully created new JobField'})
      }
      else{
        res.send({ok:false,data:'failed to create new jobField'})
      }
      
    } catch (error) {
      res.send({ok:false,data:error})
      
    }


  }
  const addSoftSkill = async (req,res)=>{
    const {jobFieldName,softSkill} = req.body;
    try {
      const findJobField = await jobField.findOne({jobFieldName})
      console.log(findJobField)
      if(findJobField){
        console.log('here')
        const updateJobField = await jobField.updateOne({findJobField},{...findJobField,softSkills:softSkill})
        
        if(updateJobField){
          console.log('here1')
          res.send({ok:true,data:'successfully added soft Skill'})
        }
        else{
          res.send({ok:false,data:'failed to add softSkill'})

        }
      }
      else{
        res.send({ok:false,data:'could not find jobField'})
      }
      
    } catch (error) {
      res.send({ok:false,data:error})
      
    }

  }
  const addHardSkill = async(req,res)=>{
    const {jobFieldName,hardSkill} = req.body;
    try {
      const findJobField = await jobField.findOne({jobFieldName})
      if(findJobField){
        const updateJobField = await jobField.update({findJobField},{...findJobField,hardSkills:hardSkill})
        if(updateJobField){
          res.send({ok:true,data:'successfully added hard Skill'})
        }
        else{
          res.send({ok:false,data:'failed to add hard Skill'})

        }
      }
      else{
        res.send({ok:false,data:'could not find jobField'})
      }
      
    } catch (error) {
      res.send({ok:false,data:error})
      
    }

  }
  const getAllJobFields = async(req,res)=>{

  }
  const getJobField = async(req,res)=>{

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
  register,
  login,
  verify_token,
  addJobField,
  addSoftSkill,
  addHardSkill,
  getAllJobFields,
  getJobField,

}