const  JobApplication = require('../models/jobapplication')
const JobOffer = require('../models/joboffer')
const  Recruiter = require('../models/recruiter')
const JobField = require('../models/jobFields')
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
    const user = await Recruiter.findOne({ email });
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
    await Recruiter.create(newUser);
    console.log('here')
    res.json({ ok: true, message: "Successfully registered" });
  } catch (error) {
    console.log(error)
    res.json({ ok: false, error });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;
  console.log("hello");
  if (!email || !password){
    return res.json({ ok: false, message: "all input fields are required"});
  }
  if (!validator(email)){
    return res.json({ ok: false, message: "Invalid email provided" });
  }

  try {
    const user = await Recruiter.findOne({ email });

    if (!user) return res.json({ ok: false, message: "Invalid user provided" });
 
    const match = await argon2.verify(user.password, password);

  
    if (match) {
      // once user is verified and confirmed we send back the token to keep in localStorage in the client and in this token we can add some data -- payload -- to retrieve from the token in the client and see, for example, which user is logged in exactly. The payload would be the first argument in .sign() method. In the following example we are sending an object with key userEmail and the value of email coming from the "user" found in line 47
      const token = jwt.sign({email:user.email, userType:'recruiter',_id:user._id}, jwt_secret, { expiresIn: "1000h" }); //{expiresIn:'365d'}
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


const findRecruiter = async (req,res) =>{
  const {userid} = req.body;
  try {
      // true if find email
      const findRecName = await Recruiter.findOne({_id:userid}) // findOne returns the whole object (can use findAppName.password to access key password)
      console.log('findRecName',findRecName)
      if(findRecName){
        res.send({ok:true,data:findRecName})
      }
      else{
        res.send({ok:false,data:'failed to find recruiter'})
      }
    } catch (error) {
      res.send({ok:false,data:error})
    }
}

const addRecruiter = async (req,res) =>{
    const {email, password} = req.body; 
    try {
      const findRec = await Recruiter.findOne({email, password})
      if (!findRec){
        const createNew = await Recruiter.create({email, password})
        if(createNew){
          res.send({ok:true,data:'recruiter added successfully'})
        }else{
          res.send({ok:false,data:'failed to add a new recruiter'})
        }} else {
        res.send({ok:false,data:'recruiter already exists'})
      }} catch (error) {
      res.send(error)
    }
}
const deleteRecruiter = async (req,res)=>{
    const {email} = req.body;
    try {
      // find the email
      const findUsername = await Recruiter.findOneAndDelete({email})
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
    const {oldEmail,oldPassword,email, password} = req.body
    try{
        const findRec = await Recruiter.findOne({email:oldEmail,password:oldPassword})
        const findNewRec = await Recruiter.findOne({email})

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
const addJobOffer = async (req,res) =>{
    let {jobOffer} = req.body;
  

    try {
    
        const newOffer = await JobOffer.create({...jobOffer})
        
        res.send({ok:true,data:newOffer._id})
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
  
  const {jobOffer, oldJobOfferId} = req.body;


  try{
   
      // let objectid = mongoose.Types.ObjectId(jobOffer.recruitersId)
      // jobOffer.recruitersId = objectid;
      // let objectidold = mongoose.Types.ObjectId(oldJobOffer.recruitersId)
      // oldJobOffer.recruitersId = objectidold;
      // console.log(jobOffer,oldJobOffer)
      const findjobOffer = await JobOffer.findOne({_id:oldJobOfferId})
      if (findjobOffer){
        await JobOffer.updateOne(findjobOffer,jobOffer)
        res.send({ok:true, data:`Job offer updated successfully`})
      } else{
        res.send({ok:false, data:`Job offer not found`})
      }
         }catch(error){
      res.send(error)
  }
}

const getJobOffer = async(req,res)=>{
  // this id = id of one job offer
  let {id} = req.params;
    try {
      const jobOffer = await JobOffer.findOne({_id: id})
      console.log('jobOffer',jobOffer)
      if (jobOffer){
        res.send({ok: true, data: {jobOffer}})
      }else{
        res.send ({ok: false, data: "Job offer doesn't exist"})
      }
     
    } catch (error) {
      res.send(error)
    }
}

const getAllJobOffers = async(req,res)=>{
  try {
    const jobOffers = await JobOffer.find({});
    if(jobOffers){
      res.send({ok:true,data:{jobOffers}});
    }
    else{
      res.send({ok:false,data:'failed to load jobOffers'})

    }
    
  } catch (error) {
    res.send({ok:false,data:error})
    
  }
}



// //getAllMyJobOffer
const getAllMyJobOffer = async(req,res)=>{
  // id = recruiters' id
  let {id} = req.params;
  
  try {
    // empty array with objects of all the job offers that belongs to this recruiter
    // var arrJobOffer =[]
    const allJobOffers = await JobOffer.find({recruitersId: id}) // FIND ALL
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

const getActiveJobOffer = async(req,res)=>{
  const {userid} = req.params;
  try {
    const activeJobOffer = await JobOffer.findOne({active:true,recruitersId:userid})
    if(activeJobOffer){
      res.send({ok:true,data:{activeJobOffer}})
    }
    else{
      res.send( {ok:false,data:[]})
    }
  } catch (error) {
    res.send(error)
    
  }
}

// //likeApplicant
const likeApplicant = async(req,res)=>{
  const {applicationId, recruiterId}= req.body
  try {
    const find  = await JobApplication.findOne({_id: applicationId})
    console.log(find)
    await JobApplication.updateOne( find,{$push: {likedBy: {recruiter_id : recruiterId}}}) // FIND ALL
    res.send({ok:true, data:' Applicant liked successfully'})    
      // if(application){application.likedBy.push({recruiterId})}else{res.send({ok:true, data:"Applicant id could'nt be found"})}
   } catch (error) {
    res.send(error)
  }
}
// unlikeApplicant
const unlikeApplicant = async(req,res)=>{
  const {applicationId, recruiterId}= req.body
  try {
    await JobApplication.findOneAndUpdate({_id: applicationId}, {$pull: {likedBy: {recruiter_id : recruiterId}}}) // FIND ALL
    res.send({ok:true, data:' Applicant unliked successfully'})
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
  }}

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
    login,
    register,
    verify_token,
    getJobOffer,
    getActiveJobOffer,
    getAllJobOffers,
  }
