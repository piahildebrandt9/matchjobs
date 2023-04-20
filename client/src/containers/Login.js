import React, { useState,useEffect } from "react";
import Register from './Register';
import {useParams, NavLink} from 'react-router-dom'
import axios from "axios";
import { URL } from "../config";


function Login({loginFun}) {
  const [input, setInput] = useState({userName:'',password:''})
  const [button,setButton] = useState({recruiter:false, applicant:false, admin:false});
  const [msg, setMsg]= useState('');
  
  
  // getInput takes the data from the inputs and saves it in the input state variable
  const getInput = (e)=>{
    //setInput gets all data from input and changes the value of a certain key
    // e.target.name gets the name of the input
    // e.target.value gets input from input
    setInput({...input, [e.target.name]: e.target.value})

  }

  //getUser gets the information from the radio buttons and saves it in button
  const getUser = (e)=>{
    //setButton sets the user values
    // setting the keyvalue to the type of the user, and changing its value to the opposite of what it was before
    // take value of button (...) and change to the opposite (boolean) - current value - click - change value
    setButton({...button,[e.target.value]:!button[e.target.value]})
  }
  const login = async()=>{
    
    //get entries of button in an array of arrays
    //filter out all the ones who have true as the value (only one)
    
    const temp = Object.entries(button).filter(c=>c[1]=== true)
  


    // take the first entry from the only entry in temp which is the word of the key
    
    switch(temp[0][0]){

      //check which value has been checked by the button
      // calling the back end and using the corresponding controller
      //check if true and send the corresponding message (backend)
      case 'recruiter':
        
        const recruiter = await axios.post(`${URL}/recruiter/login`,{userName:input.userName,password:input.password});
        console.log(recruiter)
       
        if(recruiter.data.ok){
         
         setMsg(recruiter.data.message)
        }
        else{
          
         
          setMsg(recruiter.data.message)
        } 
        loginFun(recruiter.data.token)
        break;
      case 'applicant':
        const applicant = await axios.post(`${URL}/applicant/login`,{username:input.userName,password:input.password});
        if(applicant.ok){
          setMsg(applicant.message)
         }
         else{
           setMsg(applicant.message)
         } 
         loginFun(applicant.data.token)
        break;
      case 'admin':
        const admin = await axios.post(`${URL}/admin/login`,{username:input.userName,password:input.password});
        if(admin.ok){
          setMsg(admin.message)
         }
         else{
           setMsg(admin.message)
         } 
         loginFun(admin.token)
        break;
  
    }
    



  }


  return (
    <div>
      <h1>user name</h1>
      <input name = 'userName' onChange = {getInput}/>
      <h1>password</h1>
      <input name = 'password' onChange = {getInput}/>
      
      <button name = 'user' value = 'recruiter' type = 'radio' onClick = {getUser}>Recruiter</button>
      <button name = 'user' value = 'applicant' type = 'radio' onClick = {getUser}>Applicant</button>
      <button name = 'user' value = 'admin' type = 'radio' onClick = {getUser}>Admin</button>
      <NavLink to = '/register' ><button >register</button> </NavLink>
    
      <button onClick = {login}>login</button>
      <p>{msg}</p>





      
    </div>
  )
}

export default Login