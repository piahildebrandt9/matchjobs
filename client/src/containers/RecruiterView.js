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
    <div className = 'sheet'>
      {/* // view all data */}
      <h1 >{data.jobTitle}</h1>
      <p>{data.companyName}</p>
      <span>
      <button className = {data.remote.toString()}  name = 'remote' value = 'remote' type = 'radio' >remote</button>
      <button className = {data.onSite.toString()}  name = 'onSite' value = 'onSite' type = 'radio' >on site</button>
      <button className = {data.flexible.toString()}  name = 'flexible' value = 'flexible' type = 'radio' >flexible</button>
      </span>
      <p>{data.location}</p>
      <p>{data.minPrice}-{data.maxPrice || 'infinity'}</p>
      
      <p>Skills</p>
      <span>
      {data.jobFields.map((d) =>{
        return(
          <button className = {d.selected.toString()} key ={d.jobFieldName} disabled = {d.selected}  name = 'jobField'  type = 'radio'  >{d.jobFieldName}</button>
          
        )})}
      </span>

      <p>Soft</p>
      <span>
      {data.jobFields.findIndex(c => c.selected == true) !== -1 &&  data.softSkills[data.jobFields.findIndex(c => c.selected == true) ].map((e)=>{
      return (
        <button className = {e.selected.toString()} key={e.skillName} disabled = {e.selected} name = 'softSkills' type = 'radio' >{e.skillName}</button>
      )
      })} 
      </span>
      <p>Hard</p>
      <span>
      {data.jobFields.findIndex(c => c.selected == true) !== -1 &&  data.hardSkills[data.jobFields.findIndex(c => c.selected == true) ].map((f)=>{
      return (
        <button className = {f.selected.toString()} key ={f.skillName} disabled = {f.selected} name = 'hardSkills' type = 'radio' >{f.skillName}</button>
      )
      })}
      </span>
      <p>{data.jobDescription}</p>
      {/* <button onClick = {()=> navigate(`/recruiter/profile/${userid}`)}>back to profile</button> */}

    </div>
  )
}

export default RecruiterView