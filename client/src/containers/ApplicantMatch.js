import React, { useState,useEffect } from "react";
import {useParams} from 'react-router-dom'
import axios from "axios";
import { URL } from "../config";

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
    <div>
      {matches.map(c=>{
         return(
          <div key = {c._id}>
           
            <button className = {c.remote.toString()}  name = 'remote' value = 'remote' type = 'radio' >remote</button>
            <button className = {c.onSite.toString()}  name = 'onSite' value = 'onSite' type = 'radio' >on site</button>
            <button className = {c.flexible.toString()}  name = 'flexible' value = 'flexible' type = 'radio' >flexible</button>
            <p>{c.location}</p>
            <p>{c.minPrice}</p>
            <p>{c.maxPrice}</p>
            <h2>Skills</h2>
            {c.jobFields.map((d) =>{
              return(
                <button key = {d.jobFieldName} disabled = {d.selected}  name = 'jobField'  type = 'radio'  >{d.jobFieldName}</button>
                
              )})}
              <h3>Soft</h3>
            {c.jobFields.findIndex(c => c.selected == true) !== -1 &&  c.softSkills[c.jobFields.findIndex(c => c.selected == true) ].map((e)=>{
            return (
              <button key = {e.skillName} disabled = {e.selected} name = 'softSkills' type = 'radio' >{e.skillName}</button>
            )
            })} 
            {c.jobFields.findIndex(c => c.selected == true) !== -1 &&  c.hardSkills[c.jobFields.findIndex(c => c.selected == true) ].map((f)=>{
            return (
              <button key = {f.skillName} disabled = {f.selected} name = 'hardSkills' type = 'radio' >{f.skillName}</button>
            )
            })}
            <h1>{c.jobDescription}</h1>
            
          </div>
         )
      })}

    



    </div>
  )
}

export default ApplicantMatch