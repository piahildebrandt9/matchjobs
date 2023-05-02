import React, { useState,useEffect } from "react";
import {useParams, useNavigate} from 'react-router-dom'
import axios from "axios";
import { URL } from "../config";

function RecruiterView() {
  // params /:id
  const {id} = useParams(); // id = id of the jobOffer, userid = id of the recruiter
  // state variables
  const [data,setData] = useState({companyName:'',jobTitle:'',remote:false,onSite:false,flexible:false,minPrice:0,maxPrice:Infinity,location:'',jobFields:[],softSkills:[[]],hardSkills:[[]],jobDescription:''});

  const navigate = useNavigate();
 
  
  const loadData = async()=>{
    // loading data from backend/database to view here
    try {
      
      const load = await axios.get(`${URL}/recruiter/getJobOffer/${id}`)
      
      if(load.data.ok){
        setData(load.data.data.jobOffer)

      }
      else{
        console.log(load.data.data)

      }
    } catch (error) {
      console.log(error)

      
    }
  }
  // initially always load all data
  useEffect(()=>{

    loadData();

  },[])

  return (
    <div>
      {/* // view all data */}
      <h1 >{data.jobTitle}</h1>
      <h1>{data.companyName}</h1>
      <button className = {data.remote.toString()}  name = 'remote' value = 'remote' type = 'radio' >remote</button>
      <button className = {data.onSite.toString()}  name = 'onSite' value = 'onSite' type = 'radio' >on site</button>
      <button className = {data.flexible.toString()}  name = 'flexible' value = 'flexible' type = 'radio' >flexible</button>
    
      <p>{data.location}</p>
      <p>{data.minPrice}</p>
      <p>{data.maxPrice}</p>
      <h2>Skills</h2>
      {data.jobFields.map((d) =>{
        return(
          <button  key ={d.jobFieldName} disabled = {d.selected}  name = 'jobField'  type = 'radio'  >{d.jobFieldName}</button>
          
        )})}
        <h3>Soft</h3>
      {data.jobFields.findIndex(c => c.selected == true) !== -1 &&  data.softSkills[data.jobFields.findIndex(c => c.selected == true) ].map((e)=>{
      return (
        <button key={e.skillName} disabled = {e.selected} name = 'softSkills' type = 'radio' >{e.skillName}</button>
      )
      })} 
      {data.jobFields.findIndex(c => c.selected == true) !== -1 &&  data.hardSkills[data.jobFields.findIndex(c => c.selected == true) ].map((f)=>{
      return (
        <button key ={f.skillName} disabled = {f.selected} name = 'hardSkills' type = 'radio' >{f.skillName}</button>
      )
      })}
      <h1>{data.jobDescription}</h1>
      {/* <button onClick = {()=> navigate(`/recruiter/profile/${userid}`)}>back to profile</button> */}

    </div>
  )
}

export default RecruiterView