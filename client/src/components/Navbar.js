import React from "react";
import { NavLink } from "react-router-dom";
import {URL} from '../config'
import '../App.css'

const Navbar = ({isLoggedIn, user, logout}) => {
    // isLoggedIn is the state variable from app.js which is either true or false
    // user is the state variable with userName, userType and ._id from the token
    // logout is the final logout function

  return (
    
    <div className="navbar">
      {/* // Navbar if isLoggedIn */}
    {isLoggedIn === true
    && 
    <div className = "nav">
    <NavLink 
    to={`/${user.userType}/profile/${user._id}`}  >
    profile
    </NavLink>
    <NavLink 
    to={`/${user.userType}/main`}  >
    main
    </NavLink>
    <NavLink 
    to={`/${user.userType}/matches`}  >
    matches
    </NavLink>
    <NavLink to ={`/`} >
      <button onClick = {logout}>
    logout
    </button>
    </NavLink>
    </div>
    
    }

      {/* // Navbar if not LoggedIn */}
    {!isLoggedIn
      && <div className = "nav">

    <NavLink 
    to={"/"} aria-disabled = 'true'>
    profile
    </NavLink>
    <NavLink 
    to={`/${user.userType}/main`}  aria-disabled = 'true'>
    main
    </NavLink>
    <NavLink 
    to={`/${user.userType}/matches`}  >
    matches
    </NavLink>
    <NavLink 
    to={`/login`}  >
    login
    </NavLink>
    <NavLink 
    to={`/register`}  >
    register
    </NavLink>
    <NavLink to ={`/`} >
      <button onClick = {logout}>
    logout
    </button>
    </NavLink>

    </div>
    
      
    }

    </div>
  )
}

export default Navbar;

const linkStyles = {
 
}
