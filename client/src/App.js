import React, { useState, useEffect } from "react";
import axios from "axios";
import {BrowserRouter as Router, Route, Routes, Navigate} from 'react-router-dom'
import Login from "./containers/Login.js";
import Register from "./containers/Register.js";
import Navbar from "./components/Navbar.js";
import { URL } from "./config";
import Profile from './containers/Profile.js'
import Admin from './containers/Admin.js'
import * as jose from 'jose'


function App() {

  const [isLoggedIn, setIsLoggedIn] = useState(null);

  const [token, setToken] = useState(JSON.parse(localStorage.getItem('token')));
  const [user,SetUser] = useState(null);
  

  useEffect(
    () => {
      const verify_token = async () => {
        debugger
        try {
          if (!token) {
            setIsLoggedIn(false)
          }else {
          axios.defaults.headers.common['Authorization'] = token;
          const response = await axios.post(`${URL}/users/verify_token`);
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

  const login = (token) => {
    debugger
    localStorage.setItem("token", JSON.stringify(token));
    setIsLoggedIn(true);
    let decoded = jose.decodeJwt(token) // decoding the information form the token {userName,userType}
    SetUser(decoded) // set user to userName and user Type from token

  };
  
  const logout = () => {
    debugger
    localStorage.removeItem("token");
    setIsLoggedIn(false);
  };
  return (
    // user state variable passed to Navbar
    <Router>
    <Navbar  isLoggedIn={isLoggedIn} user ={user}/> 

    <Routes>
   
    <Route 
    path="/" 
    element={ isLoggedIn && user.userType !== 'admin' ? <Navigate to= {`/${user.userType}/profile/${user._id}`} /> : <Login login={login} />} />
    
      <Route 
    path="/" 
    element={ isLoggedIn && user.userType == 'admin' ? <Navigate to= '/admin' /> : <Login login={login} />} />

    <Route
    path="/:type/profile/:id"
    element ={< Profile />}  
    />  
    
        <Route
    path="/:type/view/:id"
    element ={< View/>}  
    />  

    <Route
    path="/:type/main/:id"
    element ={< Main />}  
    />  
     <Route
    path="/:type/matches/:id"
    element ={< Matches />}  
    />  

    
    <Route
    path="/admin"
    element ={ <Admin /> } 
    /> 



    <Route
    path="/login"
    element ={ isLoggedIn ? <Navigate to='/' /> : <Login login={login} /> } 
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
