import React, { useState,useEffect } from "react";
import {useParams, Link} from 'react-router-dom'
import axios from "axios";
import { URL } from "../config";


function Register() {
  const [input, setInput] = useState({email:'',password:'', password2:''})//current input in input html tags
  const [button,setButton] = useState(""); // 'recruiter'/'applicant'
  const [msg, setMsg]= useState(''); // output message 'successfully registered'/'failed to register'

  const getInput = (e)=>{
    //setInput gets all data from input and changes it in state input 
    setInput({...input, [e.target.name]: e.target.value})

  }

  const register = async ()=>{
    // call register function in backend
    try {
      const regInput = await axios.post(`${URL}/${button}/register`, {...input})
      setMsg(regInput.data.message)
    } catch (error) {
      console.log(error)
      
    }

  }
  const getUser = (e,type)=>{
    //setButton sets the button to the currently chosen userType
    if(button === type) {
      setButton("")
    } else {
      setButton(type)
    }
  }
  return (
    <div className = 'sheet'>
      {/* // input register information */}
      <h1>email</h1>
      <input name = 'email' onChange = {getInput}/>
      <h1>password</h1>
      <input name = 'password' onChange = {getInput}/>
      <h1>password2</h1>
      <input name = 'password2' onChange = {getInput}/>

      <span id = 'users'>
      <button className = 'choice' disabled={button === "recruiter" ? true : false} name = 'user' value = 'recruiter' type = 'radio' onClick = {(e)=>getUser(e,"recruiter")}>Recruiter</button>
      <button className = 'choice' disabled={button === "applicant" ? true : false} name = 'user' value = 'applicant' type = 'radio' onClick = {(e)=>getUser(e,"applicant")}>Applicant</button>
      </span>
      <button id = 'button' onClick = {register}>register</button>
      <p>{msg}</p>
    </div>
  )
}

export default Register