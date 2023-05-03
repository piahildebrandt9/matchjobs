import React from "react";
import { NavLink } from "react-router-dom";
import {URL} from '../config'
import '../App.css'
import { CgProfile} from 'react-icons/cg';
import { MdOutlineHandshake } from 'react-icons/md'

const Navbar = ({isLoggedIn, user, logout}) => {
    // isLoggedIn is the state variable from app.js which is either true or false
    // user is the state variable with email, userType and ._id from the token
    // logout is the final logout function

  return (
    
    <div className="navbar">
      {/* // Navbar if isLoggedIn */}
    {isLoggedIn === true
    && 
    <div className = "nav">
    <NavLink 
    to={`/${user.userType}/profile/${user._id}`}  >
    < CgProfile className = 'profile'/>
    </NavLink>
    <NavLink 
    className = 'logo'
    to={`/${user.userType}/main`}  >
    thematch
    </NavLink>
    <p>
    <NavLink 
    to={`/${user.userType}/matches`}  >
    < MdOutlineHandshake className='matches'/>
    </NavLink>
    <NavLink to ={`/`} >
      <button className = 'logout' onClick = {logout}>
    logout
    </button>
    </NavLink>
    </p>
    </div>
    
    }

      {/* // Navbar if not LoggedIn */}
    {!isLoggedIn
      && <div className = "nav">

    <NavLink
    to={"/"} aria-disabled = 'true'>
    < CgProfile  className='profile' />
    </NavLink>
    <NavLink 
    className = 'logo'
    to={`/${user.userType}/main`}  aria-disabled = 'true'>
    thematch
    </NavLink>
    <p>
    <NavLink 
    to={`/${user.userType}/matches`}  >
    < MdOutlineHandshake className='matches'/>
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
      <button className = 'logout' onClick = {logout}>
    logout
    </button>
    </NavLink>
    </p>

    </div>
    
      
    }

    </div>
  )
}

export default Navbar;

const linkStyles = {
 
}
