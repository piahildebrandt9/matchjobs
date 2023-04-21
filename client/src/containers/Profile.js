import React, { useState,useEffect } from "react";
import {useParams, Link, useNavigate} from 'react-router-dom'
import axios from "axios";
import { URL } from "../config";
import Edit from './Edit';


const Profile = ()=>{

    const {type,id} = useParams()
    const [mySheets,setMySheets] = useState([])
    const navigate = useNavigate();

    // empty new greyish jobapplication example
    // map through all jobapplications of this applicant

    // const id = user._id;
    const handleSheets = async ()=>{
        try {
            let allMySheets
        if(type === 'recruiter'){
            allMySheets = await axios.get(`${URL}/recruiter/getAllMyJobOffers/${id}`)
            // console.log(allMySheets);
        }
        else{
            allMySheets = await axios.get(`${URL}/applicant/getAllMyJobApplications/${id}`)
        }
        setMySheets(allMySheets.data.data) 
        } catch (error) {
            console.log(error);
        }
    }
   
    useEffect(()=>{
        handleSheets();
    })


    return(<>
    {/* // greyish sheet for new app/offer that can be edit */}
    {type === 'recruiter' ? <h1>Add your job offer</h1> : <h1>Add your application</h1> }
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
    <button onClick = {() => < Edit type = {type} id = '' userid={id}/>}>edit</button> 
    <button>activate</button>

{/* // maping all existing applications or offers */}
{/* // depending on the element caught by the maping will use infos of applicants or recruiters */}
    {mySheets.map(c =>{return( 
        <>
        {/* <Link to = {`/${type}/view/${c._id}`}> */}
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
        
       <p>information{(type) (c._id) (id)}</p>
        {/* use userid here also */}
        
        <button  onClick= {()=>{navigate(`/${type}/edit/${c._id}/${id}`)}}>edit</button>
        <button onClick = {()=> c.active = !c.active}>activate</button>
        {/* </Link> */}
        </>
    )} 

    )}
    </>)

}
export default Profile