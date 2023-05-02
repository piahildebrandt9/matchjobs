import React, { useState,useEffect } from "react";
import {useParams} from 'react-router-dom'
import axios from "axios";
import { URL } from "../config";


function ApplicantMain({user}) {

  // get all jobOffers and save to state variable
  const [JobOffers,setJobOffers] = useState([]);
  
  // sort by overlapping with acitvated jobApplication
  const setUpJobOffers = async()=>{
    try {
      // get All Job Offers from db
      const getAll = await axios.get(`${URL}/recruiter/getAllJobOffers`)
      
      const allJobOffers = getAll.data.data.jobOffers;
      // get currently active jobOffer
      const activeJobApplication = await getActiveJobApplication();
      
   
      // count similarities
      let count = [];
      
      allJobOffers.forEach((item,idx)=>{
        count[idx] = 0;
        console.log('item',item)
        console.log('active...',activeJobApplication)
       
        if(item.jobFields.filter(c=>c.selected== true)[0].jobFieldName == activeJobApplication.jobFields.filter(c=>c.selected == true)[0].jobFieldName){
          
          if(item.remote == activeJobApplication.remote){
            count[idx] +=1;
          }
          if(item.flexible== activeJobApplication.flexible){
            count[idx] += 1;
          }
          if(item.onSite== activeJobApplication.onSite){
            count[idx] += 1;
          }
          if(item.location== activeJobApplication.location){
            count[idx] += 1;
          }
          if(item.minPrice >= activeJobApplication.minPrice){
            count[idx]+=1;
          }
          if(item.maxPrice >= activeJobApplication.maxPrice){
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
      const sortedOffers = [];
      newcount.forEach((item)=>{
        
        sortedOffers.push(allJobOffers[item.idx])
      })
      
      // save sorted JobOffers in JobOffers state variable
      setJobOffers(sortedOffers);
      
    } catch (error) {
      console.log(error)
      
    }
  }

  // get the currently active jobApplication from db/backend
  const getActiveJobApplication = async()=>{
    try {
      const getActiveJobApp = await axios.get(`${URL}/applicant/getActiveJobApplication/${user._id}`)
      if(getActiveJobApp.data.ok){
        return(getActiveJobApp.data.data.activeJobApp)

      }
      else{
        return([])
      }
      
    } catch (error) {
      console.log(error)
      
    }

  }

  // like one jobOffer in db/backend
  const likeOffer=async(c,cId)=>{
    try {
      // check if applicant already liked this jobOffer
      if(!c.likedBy.map(d=>d.applicant_id).includes(user._id)){
        // like JobOffer
        const like = await axios.post(`${URL}/applicant/likeOffer`,{offerId:cId,applicantId:user._id})
        if(!like.data.data.ok){
          console.log('failed to like jobOffer')
        }
      }
      
    } catch (error) {
      console.log(error)
    }

  }

  // at initialization set up job Offers
  useEffect(()=>{
    setUpJobOffers();
  },[])

  return(
    <div className = 'wrapper'>
      {JobOffers.map(c =>{
    return (
      <div className = 'sheet' key = {c._id}>
         <span>
        <button className = {c.remote.toString()}  name = 'remote' value = 'remote' type = 'radio' >remote</button>
        <button className = {c.onSite.toString()}  name = 'onSite' value = 'onSite' type = 'radio' >on site</button>
        <button className = {c.flexible.toString()}  name = 'flexible' value = 'flexible' type = 'radio' >flexible</button>
        </span>
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
        <p>{c.jobDescription}</p>
        <button id = 'button' onClick = {()=> likeOffer(c,c._id)}>like</button>
  
  
      </div>
    )

  })}

    </div>
  )
  
  
}

export default ApplicantMain
