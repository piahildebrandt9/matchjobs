import React, { useState,useEffect } from "react";
import {useParams} from 'react-router-dom'
import axios from "axios";
import { URL } from "../config";




function RecruiterMain({user}) {

  // get all jobApplications and save to state variable
  const [JobApplications,setJobApplications] = useState([]);
  
  // sort by overlapping with acitvated jobOffer
  const setUpJobApplications = async()=>{
    try {
      // get All Job Applications from db
      const getAll = await axios.get(`${URL}/applicant/getAllJobApplications`)
      
      const allJobApps = getAll.data.data.jobApps;
      // get currently active jobOffer
      const activeJobOffer = await getActiveJobOffer();
      
    
      // count similarities
      let count = [];

      allJobApps.forEach((item,idx)=>{
        count[idx] = 0;
       
        if(item.jobFields.filter(c=>c.selected== true)[0].jobFieldName == activeJobOffer.jobFields.filter(c=>c.selected == true)[0].jobFieldName){
          
          if(item.remote == activeJobOffer.remote){
            count[idx] +=1;
          }
          if(item.flexible== activeJobOffer.flexible){
            count[idx] += 1;
          }
          if(item.onSite== activeJobOffer.onSite){
            count[idx] += 1;
          }
          if(item.location== activeJobOffer.location){
            count[idx] += 1;
          }
          if(item.minPrice <= activeJobOffer.minPrice){
            count[idx]+=1;
          }
          if(item.maxPrice <= activeJobOffer.maxPrice){
            count[idx]+=1;
          } 
        }
      })
      
      // sort by counted similarities
      const newcount = []
      count.forEach((item,idx)=>{
        newcount.push({count:item,idx:idx})

      })
      newcount.sort((a,b) => b.count -a.count)
      const sortedApps = [];
      newcount.forEach((item)=>{
        
        sortedApps.push(allJobApps[item.idx])
      })

      // save sorted Applications in JobApplication state variable
      setJobApplications(sortedApps);
      
    } catch (error) {
      console.log(error)
      
    }
  }

  // get the currently active jobOffer from db/backend
  const getActiveJobOffer = async()=>{
    try {
      const getActiveJobOffer = await axios.get(`${URL}/recruiter/getActiveJobOffer/${user._id}`)
      if(getActiveJobOffer.data.ok){
        return(getActiveJobOffer.data.data.activeJobOffer)

      }
      else{
        return([])
      }
      
    } catch (error) {
      console.log(error)
      
    }

  }

  // like one APPLICATION in db/backend
  const likeApplicant=async(c,cId)=>{
    try {
      // check if recruiter already liked this application
      if(!c.likedBy.map(c => c.recruiter_id).includes(user._id)){
        // like job Application
        const like = await axios.post(`${URL}/recruiter/likeApplicant`,{applicationId:cId,recruiterId:user._id})
        if(!like.data.data.ok){
          console.log('failed to like application')
        }
      }
    } catch (error) {
      console.log(error)
    }

  }

  // at initialization set up job applications
  useEffect(()=>{
    setUpJobApplications();
  },[])


  return (
    <div className = 'sheet'>
      {/* // map through jobApplications */}
      {JobApplications.map(c=>{
        return(
          <div  key = {c._id}>
           
            <button className = {c.remote.toString()}  name = 'remote' value = 'remote' type = 'radio' >remote</button>
            <button className = {c.onSite.toString()}  name = 'onSite' value = 'onSite' type = 'radio' >on site</button>
            <button className = {c.flexible.toString()}  name = 'flexible' value = 'flexible' type = 'radio' >flexible</button>
            <p>{c.location}</p>
            <p>{c.minPrice}-{c.maxPrice || 'inifinity'}</p>
            
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
                <button className = {e.selected.toString()} key = {e.skillName} disabled = {e.selected} name = 'softSkills' type = 'radio' >{e.skillName}</button>
              )
              })} 
              </span>
              <span>
              {c.jobFields.findIndex(c => c.selected == true) !== -1 &&  c.hardSkills[c.jobFields.findIndex(c => c.selected == true) ].map((f)=>{
              return (
                <button className = {f.selected.toString()} key = {f.skillName} disabled = {f.selected} name = 'hardSkills' type = 'radio' >{f.skillName}</button>
              )
              })}
              </span>
            </div>
            <p>{c.bio}</p>
            <button id = 'button' onClick = {()=> likeApplicant(c,c._id)}>like</button>


          </div>
        )
        
      })}
      


    </div>
  )
}

export default RecruiterMain
