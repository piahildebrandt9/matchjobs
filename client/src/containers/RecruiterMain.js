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
      const getAll = await axios.get(`${URL}/applicant/getAllJobApplications`)
      //console.log(getAll.data.data.jobApps)
      const allJobApps = getAll.data.data.jobApps;
     
      const activeJobOffer = await getActiveJobOffer();
      console.log(activeJobOffer)
    
      // count similarities
      let count = [];

      

      allJobApps.forEach((item,idx)=>{
        // if jobField == 
        count[idx] = 0;
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


      })
      
      const newcount = []
      count.forEach((item,idx)=>{
        newcount.push({count:item,idx:idx})

      })
   
      newcount.sort((a,b) => b.count -a.count)
      

      const sortedApps = [];
      newcount.forEach((item)=>{
        
        sortedApps.push(allJobApps[item.idx])
      })
      setJobApplications(sortedApps);
        
      
      
      
    } catch (error) {
      console.log(error)
      
    }
  }

  const getActiveJobOffer = async()=>{
    try {
      const getActiveJobOffer = await axios.get(`${URL}/recruiter/getActiveJobOffer/${user._id}`)
      
      return(getActiveJobOffer.data.data.activeJobOffer)

      

      
    } catch (error) {
      console.log(error)
      
    }

  }

  const likeApplicant=async(cId)=>{
    try {
      
      const likeApp = await axios.post(`${URL}/recruiter/likeApplicant`,{applicationId:cId,recruiterId:user._id})
      console.log(likeApp)
    } catch (error) {
      
    }

  }


  useEffect(()=>{
    
    setUpJobApplications();

  },[])
  return (
    <div>
      {/* // map through jobApplications */}
      {JobApplications.map(c=>{
        return(
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
            <button onClick = {()=> likeApplicant(c._id)}>like</button>


          </div>
        )
        
      })}
      


    </div>
  )
}

export default RecruiterMain
