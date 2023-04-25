import React, { useState,useEffect } from "react";
import Register from './Register';
import {useParams, NavLink, useNavigate} from 'react-router-dom'
import axios from "axios";
import { URL } from "../config";
import * as jose from 'jose';


// passe la fonction pour le token
function Login({finalLogin}) {
  const [input, setInput] = useState({userName:'',password:''})
  const [button,setButton] = useState("");
  const [msg, setMsg]= useState('');

  const navigate = useNavigate();
  
  
  // getInput takes the data from the inputs and saves it in the input state variable
  const getInput = (e)=>{
    //setInput gets all data from input and changes the value of a certain key
    // e.target.name gets the name of the input
    // e.target.value gets input from input
    setInput({...input, [e.target.name]: e.target.value})

  }

  //getUser gets the information from the radio buttons and saves it in button
  const getUser = (e,type)=>{
    //setButton sets the user values
    // setting the keyvalue to the type of the user, and changing its value to the opposite of what it was before
    // take value of button (...) and change to the opposite (boolean) - current value - click - change value
    if(button === type) {
      setButton("")
    } else {
      setButton(type)
    }
  }
  const login = async()=>{
    //get entries of button in an array of arrays
    //filter out all the ones who have true as the value (only one)
    
    
    
    // const temp = Object.entries(button).filter(c=>c[1]=== true)
  // take the first entry from the only entry in temp which is the word of the key
    switch(button){

      //check which value has been checked by the button
      // calling the back end and using the corresponding controller
      //check if true and send the corresponding message (backend)
      case 'recruiter':
        const recruiter = await axios.post(`${URL}/recruiter/login`,{userName:input.userName,password:input.password});
       console.log(recruiter)
        if(recruiter.data.ok){
          setMsg(recruiter.data.message)
          finalLogin(recruiter.data.token)
          let decoded = jose.decodeJwt(recruiter.data.token)
          console.log(decoded) 
          
          navigate(`/recruiter/profile/${decoded._id}`)
        }
        else{
          setMsg(recruiter.data.message)
        } 
        // pour le token
        
        break;
      case 'applicant':
        const applicant = await axios.post(`${URL}/applicant/login`,{userName:input.userName,password:input.password});
        console.log(applicant)
        if(applicant.ok){
          setMsg(applicant.data.message)
          finalLogin(applicant.data.token)
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
    
    
    
    
    
    
  }

  return (
    <div>
      <h1>user name</h1>
      <input name = 'userName' onChange = {getInput}/>
      <h1>password</h1>
      <input name = 'password' onChange = {getInput}/>
      
      <button disabled={button === "recruiter" ? true : false} name = 'user' value = 'recruiter' type = 'radio' onClick = {(e)=>getUser(e,"recruiter")}>Recruiter</button>
      <button disabled={button === "applicant" ? true : false} name = 'user' value = 'applicant' type = 'radio' onClick = {(e)=>getUser(e,"applicant")}>Applicant</button>
      <button  disabled={button === "admin" ? true : false}name = 'user' value = 'admin' type = 'radio' onClick = {(e)=>getUser(e,"admin")}>Admin</button>
      <NavLink to = '/register' ><button >register</button> </NavLink>
    
      <button onClick = {login}>login</button>
      <p>{msg}</p>
 </div>
  )
}
export default Login