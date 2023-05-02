import React, { useState,useEffect } from "react";
import {useParams} from 'react-router-dom'
import axios from "axios";
import { URL } from "../config";
import { AiOutlineMail } from 'react-icons/ai'

function ApplicantMatch({user}) {
 const [matches,setMatches] = useState([]); // applications that match [location:...,remote:...,...]


  // load jobOffers and jobApplication and find matches
  const setUpMatches =async()=>{

    try {
      // get my active jobApplication
      const myactiveApp = await axios.get(`${URL}/applicant/getActiveJobApplication/${user._id}`)
      const activeApp = myactiveApp.data.data.activeJobApp;
      
      
      //get all recruitersids of the recruiters who liked my acitve application
      const recruitersids = activeApp.likedBy.map(c => c.recruiter_id)

       // get all offers
       const getAllJobOffers = await axios.get(`${URL}/recruiter/getAllJobOffers`);
       const allOffers = getAllJobOffers.data.data.jobOffers;

      // filter offers by the ones whos recruitersId is in the likedBy list recruitersids
       const filterRecruiterIds = []

       for(var item of recruitersids){
        filterRecruiterIds.push(allOffers.filter(c => c.recruitersId == item))
       }

       // find final matches 
       const finalmatches = filterRecruiterIds.flat(1).filter(c => c.likedBy.map(d => d.applicant_id).includes(user._id))
 
      
       setMatches(finalmatches)
       
    } catch (error) {
      console.log(error)  
    }
  }


  useEffect(()=>{
    setUpMatches();

  },[])


  return (
    <div className = 'sheet'>
      {matches.map(c=>{
         return(
          <div key = {c._id}>
           
            <button className = {c.remote.toString()}  name = 'remote' value = 'remote' type = 'radio' >remote</button>
            <button className = {c.onSite.toString()}  name = 'onSite' value = 'onSite' type = 'radio' >on site</button>
            <button className = {c.flexible.toString()}  name = 'flexible' value = 'flexible' type = 'radio' >flexible</button>
            <p>{c.location}</p>
            <p>{c.minPrice}-{c.maxPrice || 'infinity'}</p>
            <div className = 'skills'>
            <span>
            {c.jobFields.map((d) =>{
              return(
                <button className = {d.selected.toString()} key = {d.jobFieldName} disabled = {d.selected}  name = 'jobField'  type = 'radio'  >{d.jobFieldName}</button>
                
              )})}
            </span>
            
            <span>
            {c.jobFields.findIndex(c => c.selected == true) !== -1 &&  c.softSkills[c.jobFields.findIndex(c => c.selected == true) ].map((e)=>{
            return (
              <button className = {e.selected.toString()}  key = {e.skillName} disabled = {e.selected} name = 'softSkills' type = 'radio' >{e.skillName}</button>
            )
            })} 
            </span>
            
            <span>
            {c.jobFields.findIndex(c => c.selected == true) !== -1 &&  c.hardSkills[c.jobFields.findIndex(c => c.selected == true) ].map((f)=>{
            return (
              <button className = {f.selected.toString()}  key = {f.skillName} disabled = {f.selected} name = 'hardSkills' type = 'radio' >{f.skillName}</button>
            )
            })}
            </span>
            </div>
            <p>{c.jobDescription}</p>
            <button id = 'contactbutton'><AiOutlineMail className = 'contact' /></button>
            
          </div>
         )
      })}

    



    </div>
  )
}

export default ApplicantMatch