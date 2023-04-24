import React, { useState,useEffect } from "react";
import {useParams, Link} from 'react-router-dom'
import axios from "axios";
import { URL } from "../config";
import Edit from './Edit';

function Register() {
  const [input, setInput] = useState({userName:'',password:'', password2:''})
  const [button,setButton] = useState(""); // 'recruiter'/'applicant'
  const [msg, setMsg]= useState(''); 

  const getInput = (e)=>{
    //setInput gets all data from input and changes the value of a certain key
    // e.target.name gets the name of the input
    // e.target.value gets input from input
    setInput({...input, [e.target.name]: e.target.value})

  }

  const register = async ()=>{
    try {
      const regInput = await axios.post(`${URL}/recruiter/register`, {...input})
      console.log(regInput)
    } catch (error) {
      console.log(error)
      
    }

  }
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
  return (
    <div>

      <h1>user name</h1>
      <input name = 'userName' onChange = {getInput}/>
      <h1>password</h1>
      <input name = 'password' onChange = {getInput}/>
      <h1>password2</h1>
      <input name = 'password2' onChange = {getInput}/>

      
      <button disabled={button === "recruiter" ? true : false} name = 'user' value = 'recruiter' type = 'radio' onClick = {(e)=>getUser(e,"recruiter")}>Recruiter</button>
      <button disabled={button === "applicant" ? true : false} name = 'user' value = 'applicant' type = 'radio' onClick = {(e)=>getUser(e,"applicant")}>Applicant</button>
      <button onClick = {register}>register</button>
      <p>{msg}</p>
    </div>
  )
}

export default Register