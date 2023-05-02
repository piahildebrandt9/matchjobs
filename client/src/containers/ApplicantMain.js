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
      
      console.log(activeJobApplication)
      // count similarities
      let count = [];
      
      allJobOffers.forEach((item,idx)=>{
        count[idx] = 0;
        console.log(item)
       
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
      console.log(sortedOffers)
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
  const likeOffer=async(cId)=>{
    try {
      const likeOffer = await axios.post(`${URL}/applicant/likeOffer`,{offerId:cId,applicantId:user._id})
      
    } catch (error) {
      console.log(error)
    }

  }

  // at initialization set up job Offers
  useEffect(()=>{
    setUpJobOffers();
  },[])

  return(
    <div>
      {JobOffers.map(c =>{
    return (
      <div>
         
         <button className = {c.remote.toString()}  name = 'remote' value = 'remote' type = 'radio' >remote</button>
              <button className = {c.onSite.toString()}  name = 'onSite' value = 'onSite' type = 'radio' >on site</button>
              <button className = {c.flexible.toString()}  name = 'flexible' value = 'flexible' type = 'radio' >flexible</button>
              <p>{c.location}</p>
              <p>{c.minPrice}</p>
              <p>{c.maxPrice}</p>
              <h2>Skills</h2>
              {c.jobFields.map((d) =>{
                return(
                  <button  disabled = {d.selected}  name = 'jobField'  type = 'radio'  >{d.jobFieldName}</button>
                  
                )})}
                <h3>Soft</h3>
              {c.jobFields.findIndex(c => c.selected == true) !== -1 &&  c.softSkills[c.jobFields.findIndex(c => c.selected == true) ].map((e)=>{
              return (
                <button disabled = {e.selected} name = 'softSkills' type = 'radio' >{e.skillName}</button>
              )
              })} 
              {c.jobFields.findIndex(c => c.selected == true) !== -1 &&  c.hardSkills[c.jobFields.findIndex(c => c.selected == true) ].map((f)=>{
              return (
                <button disabled = {f.selected} name = 'hardSkills' type = 'radio' >{f.skillName}</button>
              )
              })}
              <h1>{c.jobDescription}</h1>
              <button onClick = {()=> likeOffer(c._id)}>like</button>
  
  
      </div>
    )

  })}

    </div>
  )
  
  
}

export default ApplicantMain
