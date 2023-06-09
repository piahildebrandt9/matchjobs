import React, { useState,useEffect } from "react";
import {useParams, NavLink, useNavigate} from 'react-router-dom'
import axios from "axios";
import { URL } from "../config";



function RecruiterProfile() {
  // param /:id
  const {id} = useParams() // userid
  // state variables
  const [myJobOffers,setMyJobOffers] = useState([]) // [{jobTitle:...,jobDescription:...}] or []
  // useNavigate
  const navigate = useNavigate();

  // load all jobOffers of this recruiter
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

  const deleteJobOffer = async(cId)=>{
    try {
      await axios.post(`${URL}/recruiter/deleteJobOffer`,{offersId:cId})
    
    handleJobOffers();
      
    } catch (error) {
      console.log(error)
      
    }
    


  }

  // change active status when clicking the active button
  const setActive = async(cId,c)=>{
    try {
      // find Index of chosen joboffer
      const idx = myJobOffers.findIndex(d => d._id == cId)
      // make copy of current job offers array
      const temp = [...myJobOffers]
      // change value of this offer to the opposite
      if(temp[idx].active){
        
        temp.map(d=>d.active = false);
      }
      else{
        temp.map(d=>d.active = false);
        temp[idx].active = true;

      }
    
      // update myJobOffers state variable
      setMyJobOffers(temp)
      
      
      
    } catch (error) {
      console.log(error)
    }
  }

  //update db when changing myJobOffer
  const updateOffer = async(offer,id)=>{
    try {
      const update = await axios.post(`${URL}/recruiter/updateJobOffer`,{jobOffer:offer,oldJobOfferId:id})
    
      if(!update.data.ok){
        console.log('failed to change active status')
      }
      
    } catch (error) {
      console.log(error)
      
    }

  }



  // initially always load all jobOffers of this recruiter
  useEffect(()=>{
      handleJobOffers();
  },[])
  

  useEffect(()=>{
    if(myJobOffers){
      for(var item of myJobOffers){
        updateOffer(item,item._id);
      }

    }
    
  },[myJobOffers])



  
  return (
    <div>

    {/* // example job offer sheet in grey  */}
    <div className="sheet">
    <h1>Add your job offer</h1>
    {/* <p> location icon and location</p>
    <p>min salary</p>
    <p>max salary</p>
    <h2>Skills</h2>
    <p>job Field</p>
    <h3>Soft</h3>
    <h3>Hard</h3> */}
    <button id = 'button' onClick = {()=> navigate( `/recruiter/edit/${null}/${id}`)} >add</button> 
    {/* <button>activate</button>  */}
    </div>


    {/* // display allmyJobOffers each in a new sheet */}
    <div className = 'wrapper'>
    {myJobOffers && myJobOffers.map(c=>{return( 
        <div className = 'sheet' key={c._id}>

        <NavLink className = 'biglink' to = {`/recruiter/view/${c._id}`}>
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
                <button className={d.selected.toString()} key={d.jobFieldName} disabled={d.selected}  name='jobField'  type= 'radio'  >{d.jobFieldName}</button>
                
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
          <button  id = 'button' onClick = {()=> navigate( `/recruiter/edit/${c._id}/${id}`)} >edit</button>
          <button  id = 'button' onClick = {()=>deleteJobOffer(c._id)}>delete</button>
        </span>
        <button  id = 'activating' className = {c.active.toString()} onClick = {() => setActive(c._id,c)}>activ</button>

        </div>
    )} 
    )}
    </div>
    </div>
  )
}

export default RecruiterProfile


    