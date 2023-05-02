import React, { useState,useEffect } from "react";
import {useParams} from 'react-router-dom'
import axios from "axios";
import { URL } from "../config";
import { AiOutlineMail } from 'react-icons/ai'



function RecruiterMatch({user}) {

  const [matches,setMatches] = useState([]); // applications that match [location:...,remote:...,...]


  // load applications and jobOffer and find matches
  const setUpMatches =async()=>{

    try {
      // get my active jobOffer
      const myactiveOffer = await axios.get(`${URL}/recruiter/getActiveJobOffer/${user._id}`)
      const activeOffer = myactiveOffer.data.data.activeJobOffer;
      
      
      //get all applicantsids of the applicants who liked my acitve offer
      const applicantsids = activeOffer.likedBy.map(c => c.applicant_id)

       // get all applications
       const getallapplications = await axios.get(`${URL}/applicant/getAllJobApplications`);
       const allApplications = getallapplications.data.data.jobApps;

      // filter applications by the ones whos applicantsId is in the likedBy list applicantsids
       const filterapplicantsids = []

       for(var item of applicantsids){
        filterapplicantsids.push(allApplications.filter(c => c.applicantsId == item))
       }

       // find final matches 
       const finalmatches = filterapplicantsids.flat(1).filter(c => c.likedBy.map(d => d.recruiter_id).includes(user._id))
 
      
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
            <p>{c.bio}</p>
            <button id = 'contactbutton'><AiOutlineMail className = 'contact' /></button>

            
          </div>
         )
      })}

    



    </div>
  )
}

export default RecruiterMatch