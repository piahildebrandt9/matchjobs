import React, { useState,useEffect } from "react";
import {useParams, NavLink, useNavigate} from 'react-router-dom'
import axios from "axios";
import { URL } from "../config";



function ApplicantProfile() {
  // param /:id
  const {id} = useParams() // userid = id of applicant
  //declare state variables
  const [myJobApplications,setMyJobApplications] = useState([]) // [{jobTitle:...,jobDescription:...}] or []
  // useNavigate
  const navigate = useNavigate();

  // load all Job Applications of this applicant
  const handleJobApplications = async ()=>{
    try {
      // load all jobApplications of this applicant (id) from backend => database
      let allMyJobApplications = await axios.get(`${URL}/applicant/getAllMyJobApplications/${id}`) // [{jobTitle:...,jobDescription:...}] 
      
      // if allMyJobApplications is not empty
      if (allMyJobApplications){
        setMyJobApplications(allMyJobApplications.data.data) 
      }
      else{
      allMyJobApplications = [];
      }
    } catch (error) {
        console.log(error);
  }}

  const deleteJobApplication = async(cId)=>{

    const deleteApp = await axios.post(`${URL}/applicant/deleteApplication`,{applicationId:cId})
    console.log(deleteApp)
    handleJobApplications();


  }

  const setActive = async(cId,c)=>{
    try {
      c.active = !c.active;
      const updateApp = await axios.post(`${URL}/applicant/updateJobApplication`,{jobApplication:c,oldJobApplicationId:cId})
      if(!updateApp){
          console.log('failed to update JobApplication')
      }
      
    } catch (error) {
      console.log(error) 
    }
  }


  // at initializing render always getAllMyJobApplicatons(handleJobApplications) from backend => database
  useEffect(()=>{
      handleJobApplications();
  },[])



  return (
    <div>

    {/* // example job applications sheet in grey  */}
    <h1>Add your job Application</h1>
    {/* <p> location icon and location</p>
    <p>min salary</p>
    <p>max salary</p>
    <h2>Skills</h2>
    <p>job Field</p>
    <h3>Soft</h3>
    <h3>Hard</h3> */}
    <button onClick = {()=> navigate( `/applicant/edit/${null}/${id}`)} >add</button> 
    {/* <button>activate</button>  */}



    {/* // display allmyJobApplications each in a new sheet */}
    {myJobApplications.map(c =>{return( 
        <div key = {c._id}>
        <NavLink to = {`/applicant/view/${c._id}`}>
        <h1>{c.jobTitle}</h1>
        <p>{c.location}</p>
        <button className = {c.remote.toString()}  name = 'remote' value = 'remote' type = 'radio' >remote</button>
        <button className = {c.onSite.toString()}  name = 'onSite' value = 'onSite' type = 'radio' >on site</button>
        <button className = {c.flexible.toString()}  name = 'flexible' value = 'flexible' type = 'radio' >flexible</button>
    
        <p>{c.minPrice}</p>
        <p>{c.maxPrice}</p>
        <h2>Skills</h2>
        <p>Job Fields</p>
        {c.jobFields.map((d) =>{
        return(
          <button key={d.jobFieldName} disabled = {d.selected}  name = 'jobField'  type = 'radio'  >{d.jobFieldName}</button>
          
        )})}
         <h3>Soft</h3>
        {c.jobFields.findIndex(c => c.selected == true) !== -1 &&  c.softSkills[c.jobFields.findIndex(c => c.selected == true) ].map((e)=>{
        return (
          <button key={e.skillName} disabled = {e.selected} name = 'softSkills' type = 'radio' >{e.skillName}</button>
        )
        })}
         {c.jobFields.findIndex(c => c.selected == true) !== -1 &&  c.hardSkills[c.jobFields.findIndex(c => c.selected == true) ].map((f)=>{
        return (
          <button key={f.skillName} disabled = {f.selected} name = 'hardSkills' type = 'radio' >{f.skillName}</button>
        )
        })}
        </NavLink>
        <button onClick = {()=> navigate( `/applicant/edit/${c._id}/${id}`)} >edit</button>
        <button  className = {c.active.toString()} onClick = {() => setActive(c._id,c)}>activate</button>
        <button onClick = {()=>deleteJobApplication(c._id)}>delete</button>
        
        </div>
    )} 
    )}
    </div>
  )
}

export default ApplicantProfile


    