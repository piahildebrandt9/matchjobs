import React from "react";
import { NavLink } from "react-router-dom";
import {URL} from '../config'

const Navbar = ({isLoggedIn, user}) => {
    // user is the state variable with userName and userType from the token

  return (
    <div className="navbar">
    {isLoggedIn === true
    && 
    <>
    <NavLink 
    to={`/${user.userType}/profile/${user._id}`}  >
    icon profile
    </NavLink>
    <NavLink 
    to={`/${user.userType}/main`}  >
    logo
    </NavLink>
    <NavLink 
    to={`/${user.userType}/matches`}  >
    matches sign
    </NavLink>

    </>
    
    }


    {!isLoggedIn
      && <>

    <NavLink 
    to={"/"} aria-disabled = 'true'>
    icon profile
    </NavLink>
    <NavLink 
    to={`/${user.userType}/main`}  aria-disabled = 'true'>
    logo
    </NavLink>
    <NavLink 
    to={`/register`}  >
    register
    </NavLink>
    <NavLink 
    to={`/login`}  >
    login
    </NavLink>
    <NavLink 
    to={`/${user.userType}/matches`}  >
    matches sign
    </NavLink>
    </>
      
    }

    </div>
  )
}

export default Navbar;

const linkStyles = {
 
}
