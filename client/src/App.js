import React, { useState, useEffect } from "react";
import {BrowserRouter as Router, Route, Routes, Navigate} from 'react-router-dom';
import axios from "axios";
import * as jose from 'jose';
import { URL } from "./config";

import Login from "./containers/Login.js";
import Register from "./containers/Register.js";
import Navbar from "./components/Navbar.js";
import Admin from './containers/Admin.js';

import RecruiterProfile from './containers/RecruiterProfile.js';
import ApplicantProfile from './containers/ApplicantProfile.js';
import RecruiterEdit from './containers/RecruiterEdit'
import ApplicantEdit from './containers/ApplicantEdit'
import RecruiterView from './containers/RecruiterView';
import ApplicantView from './containers/ApplicantView';
import ApplicantMain from './containers/ApplicantMain';
import ApplicantMatch from './containers/ApplicantMatch';
import RecruiterMain from './containers/RecruiterMain';
import RecruiterMatch from './containers/RecruiterMatches';





function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(""); // true if token in localStorage still valid, false if not
  const [token, setToken] = useState(JSON.parse(localStorage.getItem('token'))); // name of the token saved in loval storage
  const [user,setUser] = useState([]); // {userName, userType:'recruiter'/'applicant',_id} or []
  

  useEffect(
    () => {
      // verify if there is the token in local storage and set loggedIn according to it
      const verify_token = async () => {
        try {
         
          if (!token) {
            // no token in local storage
            setIsLoggedIn(false)
          }else {
            // valid token  in localStorage
          axios.defaults.headers.common['Authorization'] = token;
          let decoded = jose.decodeJwt(token) // decoding the information from the token {userName,userType,_id}
   
          const response = await axios.post(`${URL}/${decoded.userType}/verify_token`); // call function verify token in backend which verify the secret jwt password for token
          return response.data.ok ? login(token) : logout();
          }
        } catch (error) {
          console.log(error);
        }
      };
      verify_token();
    }, 
    [token] // for every change of the state variable token, reload verify_token
    );





// final login function
  const login = (token) => {

    localStorage.setItem("token", JSON.stringify(token));
    
    setIsLoggedIn(true);
    let decoded = jose.decodeJwt(token) // decoding the information form the token {userName,userType}
    setUser(decoded) // set user to userName and user Type from token
    
    
  };
  
  // final logout functiokn
  const logout = () => {  
    localStorage.removeItem("token");
    setIsLoggedIn(false);
  };



  return (
    
    <Router>
    {/* // navbar always visible with props isLoggedIn = true/false, user = {userName, userType:'recruiter'/'applicant',_id} or [] */}
    <Navbar  isLoggedIn={isLoggedIn} user ={user} logout = {logout}/> 

      <Routes>
      
        <Route 
        path="/" 
        element={ isLoggedIn && user.userType !== 'admin' ? <Navigate to= {`/${user.userType}/profile/${user._id}`} /> : <Login finalLogin={login} />} />
        
          <Route 
        path="/" 
        element={ isLoggedIn && user.userType == 'admin' ? <Navigate to= '/admin' /> : <Login finalLogin={login} />} />

       <Route
        path="/recruiter/profile/:id"
        element ={ < RecruiterProfile />}  
        /> 
        <Route
        path="/applicant/profile/:id"
        element ={< ApplicantProfile />}  
        />    
        
        <Route
        path="/admin"
        element ={ <Admin /> } 
        /> 


          <Route
        path="/recruiter/edit/:id/:userid"
        element ={ isLoggedIn &&< RecruiterEdit />}  
        />  
           <Route
        path="/applicant/edit/:id/:userid"
        element ={ isLoggedIn && < ApplicantEdit />}  
        />  

         
        <Route
        path="/recruiter/view/:id/:userid"
        element ={ < RecruiterView/>}  
        /> 
         <Route
        path="/applicant/view/:id/:userid"
        element ={< ApplicantView/>}  
        />  
         <Route
        path="/applicant/main"
        element ={< ApplicantMain/>}  
        />  
         <Route
        path="/applicant/matches"
        element ={isLoggedIn && < ApplicantMatch/>}  
        />
          <Route
        path="/recruiter/main"
        element ={isLoggedIn && < RecruiterMain/>}  
        />  
         <Route
        path="/recruiter/matches"
        element ={isLoggedIn &&< RecruiterMatch/>}  
        />

        


        <Route
        path="/login"
        element ={ isLoggedIn ? <Navigate to='/' /> : <Login finalLogin={login} /> } 
        />
        <Route
        path="/register"
        element ={ isLoggedIn ? <Navigate to='/' /> : <Register  /> } 
        />
        {/* <Route
        path="/logout"
        element ={ !isLoggedIn ? <Navigate to='/' /> : logout() } 
        /> */}
      </Routes>
    </Router>
    );
}

export default App;
