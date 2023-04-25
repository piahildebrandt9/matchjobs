import React, { useState,useEffect } from "react";
import {useParams, NavLink, useNavigate} from 'react-router-dom'
import axios from "axios";
import { URL } from "../config";



function RecruiterProfile({isLoggedIn}) {
  const {id} = useParams() // userid
  const [myJobOffers,setMyJobOffers] = useState([]) // [{jobTitle:...,jobDescription:...}] or []
  const navigate = useNavigate();


  const handleJobOffers = async ()=>{
    try {
      // load all jobOffers of this recruiter (id) from backend => database
      let allMyJobOffers = await axios.get(`${URL}/recruiter/getAllMyJobOffers/${id}`) // [{jobTitle:...,jobDescription:...}] 
      // if allMyJobOffers is not empty
      if (allMyJobOffers){
        setMyJobOffers(allMyJobOffers.data.data) 
      }
      else{
      allMyJobOffers = [];
      }
    } catch (error) {
        console.log(error);
  }}

  // at initializing render always getAllMyJobOffers(handleJobOffer) from backend => database
  // useEffect(()=>{
  //   if(!isLoggedIn){
  //     navigate(`/login`)
  //   }
  //     handleJobOffers();
      
  // },[])

  return (
    <div>

    {/* // example job offer sheet in grey  */}
  
    <h1>Add your job offer</h1>
    {/* <p> location icon and location</p>
    <p>min salary</p>
    <p>max salary</p>
    <h2>Skills</h2>
    <p>job Field</p>
    <h3>Soft</h3>

    <h3>Hard</h3> */}
  
    <button onClick = {()=> navigate( `/recruiter/edit/${null}/${id}`)} >add</button> 
    {/* <button>activate</button>  */}




    {/* // display allmyJobOffers each in a new sheet */}
    {myJobOffers.map(c =>{return( 
        <div key = {c._id}>

        <NavLink to = {`/recruiter/view/${c._id}`}>
        <h1>{c.jobTitle}</h1>
        <p>{c.location}</p>
        <p>{c.minPrice}</p>
        <p>{c.maxPrice}</p>
        <h2>Skills</h2>
        <p>{c.jobFields}</p>
        <h3>Soft</h3>
        <p>{c.softSkills}</p>
        <h3>Hard</h3>
        <p>{c.hardSkills}</p>
        
        </NavLink>
        <button onClick = {()=> navigate( `/recruiter/edit/${c._id}/${id}`)} >edit</button>
        <button onClick = {()=> c.active = !c.active}>activate</button>
        </div>
    )} 
    )}
    </div>
  )
}

export default RecruiterProfile


    