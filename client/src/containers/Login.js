import React, { useState,useEffect } from "react";
import { NavLink, useNavigate} from 'react-router-dom'
import axios from "axios";
import { URL } from "../config";
import * as jose from 'jose';



function Login({finalLogin}) {
  //state variables
  const [input, setInput] = useState({userName:'',password:''}) // input state variable
  const [userType,setUserType] = useState(""); // userType = 'recruiter'/'applicant'
  const [msg, setMsg]= useState(''); // msg displayed in the end if login was ssuccessfull or not
  //useNavigate
  const navigate = useNavigate();
  
  
  // getInput takes the data from the inputs and saves it in the input state variable
  const getInput = (e)=>{
    //setInput gets all data from input and changes the value of a certain key
    setInput({...input, [e.target.name]: e.target.value})
  }

  //getUser gets the information from the radio buttons and saves it in button
  const getUser = (e,type)=>{
    //setUserType sets the user values
    if(userType === type) {
      setUserType("")
    } else {
      setUserType(type)
    }
  }
  const login = async()=>{
    try {
      // depending on the userType login into userType profile
    switch(userType){
      // userType 'recruiter'
      case 'recruiter':
        // login recruiter in backend
        const recruiter = await axios.post(`${URL}/recruiter/login`,{userName:input.userName,password:input.password});
      
        if(recruiter.data.ok){
          // output message from login backend
          setMsg(recruiter.data.message)
          // call final login in function in app.js which also sets user to logged in and saves token in localstorage
          finalLogin(recruiter.data.token)
          // get informatin from token
          let decoded = jose.decodeJwt(recruiter.data.token)
          // navigate to profile 
          navigate(`/recruiter/profile/${decoded._id}`)
        }
        else{
          setMsg(recruiter.data.message)
        } 
        
        
        break;
      // userType 'applicant
      case 'applicant':
        // login applicant in backend
        const applicant = await axios.post(`${URL}/applicant/login`,{userName:input.userName,password:input.password});
       
        if(applicant.data.ok){
          //output message form login backend
          setMsg(applicant.data.message)
          // call final login functino in app.js
          // set user to logged in and save token in local storage
          finalLogin(applicant.data.token)
          // get informatin from token
          let decoded = jose.decodeJwt(applicant.data.token)
          // navigate to profile page
          navigate(`/applicant/profile/${decoded._id}`)
          
        
        }
        else{
          setMsg(applicant.data.message)
        } 
        
        break;
      case 'admin':
        const admin = await axios.post(`${URL}/admin/login`,{userName:input.userName,password:input.password});
        if(admin.ok){
          setMsg(admin.data.message)
          finalLogin(admin.data.token)
        }
        else{
          setMsg(admin.data.message)
        } 
        
        break;

    }
      
    } catch (error) {
      setMsg(error)
    }
    
  }

  return (
    <div>
      <h1>user name</h1>
      <input name = 'userName' onChange = {getInput}/>
      <h1>password</h1>
      <input name = 'password' onChange = {getInput}/>
      
      <button disabled={userType === "recruiter" ? true : false} name = 'user' value = 'recruiter' type = 'radio' onClick = {(e)=>getUser(e,"recruiter")}>Recruiter</button>
      <button disabled={userType === "applicant" ? true : false} name = 'user' value = 'applicant' type = 'radio' onClick = {(e)=>getUser(e,"applicant")}>Applicant</button>
      <button  disabled={userType === "admin" ? true : false}name = 'user' value = 'admin' type = 'radio' onClick = {(e)=>getUser(e,"admin")}>Admin</button>
      <NavLink to = '/register' ><button >register</button> </NavLink>
    
      <button onClick = {login}>login</button>
      <p>{msg}</p>
 </div>
  )
}
export default Login