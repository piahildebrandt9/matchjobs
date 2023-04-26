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
  
// for every change of the state variable token, reload verify_token
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
            // set authorizatin in header to token
          axios.defaults.headers.common['Authorization'] = token;

          // decoding the information from the token {userName,userType,_id}
          let decoded = jose.decodeJwt(token) 

          // call function verify token in backend which verify the secret jwt password for token
          const response = await axios.post(`${URL}/${decoded.userType}/verify_token`); 

          // if secret jwt passwort for token valid then login otherwise logout
          return response.data.ok ? login(token) : logout();
          }
        } catch (error) {
          console.log(error);
        }
      };
      verify_token();
    }, 
    [token] 
    );





// final login function
  const login = (token) => {
    // set token in localStorage
    localStorage.setItem("token", JSON.stringify(token));

    // set loggedin state to true
    setIsLoggedIn(true);

    // decoding the information form the token {userName,userType}
    let decoded = jose.decodeJwt(token) 

    // set user {userName, userType:'recruiter'/'applicant',_id} from token
    setUser(decoded) 
    
    
  };
  
  // final logout functiokn
  const logout = () => {  
    // set token in localStorage
    localStorage.removeItem("token");

    // set logged in state to false
    setIsLoggedIn(false);
  };



  return (
    
    <Router>
    {/* // navbar always visible with props isLoggedIn = true/false, user = {userName, userType:'recruiter'/'applicant',_id} or [] */}
    <Navbar  isLoggedIn={isLoggedIn} user ={user} logout = {logout}/> 

      <Routes>
      {/* // if no specific route called go to login page or profile page if isLoggedIn = true */}
        <Route 
        path="/" 
        element={ isLoggedIn && user.userType !== 'admin' ? <Navigate to= {`/${user.userType}/profile/${user._id}`} /> : <Login finalLogin={login} />} 
        />
        
        <Route 
        path="/" 
        element={ isLoggedIn && user.userType == 'admin' ? <Navigate to= '/admin' /> : <Login finalLogin={login} />} 
        />

        <Route
        path="/admin"
        element ={ <Admin /> } 
        /> 

      {/* // profile page routes only available with id, so if you are logged in*/}
       <Route
        path="/recruiter/profile/:id"
        element ={isLoggedIn ? < RecruiterProfile /> : <Login finalLogin = {login}/>}  
        /> 
        <Route
        path="/applicant/profile/:id"
        element ={isLoggedIn ? < ApplicantProfile />: <Login finalLogin ={login}/>}  
        />    
        

        {/* // edit page only available if you are logged in and have both ids */}
          <Route
        path="/recruiter/edit/:id/:userid"
        element ={ isLoggedIn ?< RecruiterEdit /> : <Login finalLogin = {login}/>}  
        />  
           <Route
        path="/applicant/edit/:id/:userid"
        element ={ isLoggedIn ? < ApplicantEdit />: <Login finalLogin = {login}/>}  
        />  

         {/* // view of a job always available if yu have id of job */}
        <Route
        path="/recruiter/view/:id"
        element ={ < RecruiterView/>}  
        /> 
         <Route
        path="/applicant/view/:id"
        element ={< ApplicantView/>}  
        />  

        {/* // main and matches still in the working */}
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

        
        {/*// login and register routes also coppled to being loggedin or not */}
        <Route
        path="/login"
        element ={ isLoggedIn ? <Navigate to='/' /> : <Login finalLogin={login} /> } 
        />
        <Route
        path="/register"
        element ={ isLoggedIn ? <Navigate to='/' /> : <Register  /> } 
        />
       
      </Routes>
    </Router>
    );
}

export default App;
