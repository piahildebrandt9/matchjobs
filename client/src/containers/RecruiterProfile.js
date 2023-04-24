import React, { useState,useEffect } from "react";
import {useParams, Link, useNavigate} from 'react-router-dom'
import axios from "axios";
import { URL } from "../config";
import RecruiterEdit from './RecruiterEdit';


function RecruiterProfile() {

// GETTING TYPE AND ID OF THE OBJECT PASSED
const {type,id} = useParams()
// DISPLAYING THE SHEET    
    const [mySheets,setMySheets] = useState([])
// LINK    
    const navigate = useNavigate();


    // FETCHING DATA FROM THE SHEETS OF X recruiter
    // const id = user._id;
    const handleSheets = async ()=>{
      try {
        let allMySheets = await axios.get(`${URL}/recruiter/getAllMyJobOffers/${id}`)
        if (allMySheets!={}){
          setMySheets(allMySheets.data.data) 
        }else{
        allMySheets = {}
        }
      } catch (error) {
          console.log(error);
      }}

    // RENDER THE SHEETS
    useEffect(()=>{
      handleSheets();
  })

  return (
    <div>

    {/* // GREYED SHEET - TO UPDATE  */}
    <h1>Add your job offer</h1>
    <p> location icon and location</p>
    <p>min salary</p>
    <p>max salary</p>
    <h2>Skills</h2>
    <p>job Field</p>
    <h3>Soft</h3>

    <h3>Hard</h3>
    {/* // clicking will render the edit file */}
    {/* // since we are making a new one we don't have an id yet */}
    {/* // we don't have the job app (bc making a new one) but need the user id to link it afterwards */}
    <button onClick = {() =>  navigate(`/${type}/edit/null/${id}`)}>edit</button> 
    <button>activate</button> 




    {/* // DISPLAY SHEETS : ones saved in db */}
    {/* // maping all existing offers */}
    {mySheets.map(c =>{return( 
        <>
        <Link to = {`/${type}/view/${c._id}`}>
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
        <button  onClick= {() => navigate(`/${type}/edit/${c._id}/${id}`)}>edit</button>
        <button onClick = {()=> c.active = !c.active}>activate</button>
        </Link>
        </>
    )} 
    )}
    </div>
  )
}

export default RecruiterProfile


{/* // greyish sheet for new app/offer that can be edit
{type === 'recruiter' ?  : <h1>Add your application</h1> } */}

    