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

  // change active status when clicking the active button
  const setActive = async(cId,c)=>{
    try {
      // find Index of chosen jobapplication
      const idx = myJobApplications.findIndex(d => d._id == cId)
      // make copy of current jobApplications array
      const temp = [...myJobApplications]
      //change value of this application to the opposite
      if(temp[idx].active){
        temp.map(d => d.active=false)
      }
      else{
        temp.map(d => d.active = false)
        temp[idx].active = true;
      }
      
      // update myJOBApplicatons state variable
      setMyJobApplications(temp)
      
      
    } catch (error) {
      console.log(error) 
    }
  }

  const updateApp =async(appl,id)=>{
    try {
      const update = await axios.post(`${URL}/applicant/updateJobApplication`,{jobApplication:appl,oldJobApplicationId:id})
    if(!update.data.ok){
      console.log('failed to change active status')
    }
      
    } catch (error) {
      console.log(error)
      
    }
    
  }


  // at initializing render always getAllMyJobApplicatons(handleJobApplications) from backend => database
  useEffect(()=>{
      handleJobApplications();
  },[])


  useEffect(()=>{
    for(var item of myJobApplications){
      updateApp(item,item._id);
    }
  },[myJobApplications])


  return (
    <div className ='wrapper'>
    <div className = 'sheet'>
    {/* // example job applications sheet in grey  */}
    <h1>Add your job Application</h1>
    {/* <p> location icon and location</p>
    <p>min salary</p>
    <p>max salary</p>
    <h2>Skills</h2>
    <p>job Field</p>
    <h3>Soft</h3>
    <h3>Hard</h3> */}
    <button id = 'button' onClick = {()=> navigate( `/applicant/edit/${null}/${id}`)} >add</button> 
    {/* <button>activate</button>  */}
    </div>



    {/* // display allmyJobApplications each in a new sheet */}
    <div>
    {myJobApplications.map(c =>{return( 
        <div className = 'sheet' key = {c._id}>
        <NavLink className = 'biglink' to = {`/applicant/view/${c._id}`}>
          <h1>{c.jobTitle}</h1>
          <p>{c.location}</p>
          <button className = {c.remote.toString()}  name = 'remote' value = 'remote' type = 'radio' >remote</button>
          <button className = {c.onSite.toString()}  name = 'onSite' value = 'onSite' type = 'radio' >on site</button>
          <button className = {c.flexible.toString()}  name = 'flexible' value = 'flexible' type = 'radio' >flexible</button>
      
          <p>{c.minPrice}-{c.maxPrice || 'infinity'}</p>
          
          <div className = 'skills'>
            <span>
          {c.jobFields.map((d) =>{
          return(
            <button className = {d.selected.toString()} key={d.jobFieldName} disabled = {d.selected}  name = 'jobField'  type = 'radio'  >{d.jobFieldName}</button>
            
          )})}
          </span>
          <span>
          {c.jobFields.findIndex(c => c.selected == true) !== -1 &&  c.softSkills[c.jobFields.findIndex(c => c.selected == true) ].map((e)=>{
          return (
            <button className = {e.selected.toString()} key={e.skillName} disabled = {e.selected} name = 'softSkills' type = 'radio' >{e.skillName}</button>
          )
          })}
          </span>
          <span>
          {c.jobFields.findIndex(c => c.selected == true) !== -1 &&  c.hardSkills[c.jobFields.findIndex(c => c.selected == true) ].map((f)=>{
          return (
            <button className = {f.selected.toString()} key={f.skillName} disabled = {f.selected} name = 'hardSkills' type = 'radio' >{f.skillName}</button>
          )
          })}
          </span>
          </div>
        </NavLink>
        
        <span>
        <button id = 'button' onClick = {()=> navigate( `/applicant/edit/${c._id}/${id}`)} >edit</button>
        <button id = 'button' onClick = {()=>deleteJobApplication(c._id)}>delete</button>
        </span>
        
        <button id = 'activating' className = {c.active.toString()} onClick = {() => setActive(c._id,c)}>active</button>
        </div>
    )} 
    )}
    </div>
    </div>
  )
}

export default ApplicantProfile


    