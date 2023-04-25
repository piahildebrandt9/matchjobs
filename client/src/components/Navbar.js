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
    <NavLink 
    to={`/logout`}  >
    logout
    </NavLink>


    </>
    
    }


    {!isLoggedIn
      && <>

    <NavLink 
    to={"/"} aria-disabled = 'true'>
    profile
    </NavLink>
    <NavLink 
    to={`/${user.userType}/main`}  aria-disabled = 'true'>
    main
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
    matches
    </NavLink>
    <NavLink 
    to={`/logout`}  >
    logout
    </NavLink>
    </>
    
      
    }

    </div>
  )
}

export default Navbar;

const linkStyles = {
 
}
