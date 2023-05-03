
import React, { useState,useEffect } from "react";
import {useParams, useNavigate} from 'react-router-dom'
import axios from "axios";
import { URL } from "../config";

function ApplicantView() {
  // params /:id
  const {id} = useParams(); // id = id of the jobApplication, userid = id of the applicant
  // state variables
  const [data,setData] = useState({jobTitle:'',remote:false,onSite:false,flexible:false,minPrice:0,maxPrice:Infinity,location:'',jobFields:[],softSkills:[[]],hardSkills:[[]],bio:''});

  const navigate = useNavigate();
 
  
  const loadData = async()=>{
    // loading data from backend/database to view here
    try {
      
      const load = await axios.get(`${URL}/applicant/getJobApplication/${id}`)
      
      if(load.data.ok){
        setData(load.data.data.jobApp)

      }
      else{
        console.log(load.data.data)

      }
    } catch (error) {
      console.log(error)

      
    }
  }
  // initially always load data
  useEffect(()=>{

    loadData();

  },[])

  return (
    <div className = 'sheet'>
      
     
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
          <button key={d.jobFieldName} className  = {d.selected.toString()}   disabled = {d.selected}  name = 'jobField'  type = 'radio'  >{d.jobFieldName}</button>
          
        )})}
        </span>
        <p>Soft</p>
        <span>
      {data.jobFields.findIndex(c => c.selected == true) !== -1 &&  data.softSkills[data.jobFields.findIndex(c => c.selected == true) ].map((e)=>{
      return (
        <button key={e.skillName} className  = {e.selected.toString()}  disabled = {e.selected} name = 'softSkills' type = 'radio' >{e.skillName}</button>
      )
      })} 
      </span>
      <p>Hard</p>
      <span>
      {data.jobFields.findIndex(c => c.selected == true) !== -1 &&  data.hardSkills[data.jobFields.findIndex(c => c.selected == true) ].map((f)=>{
      return (
        <button key={f.skillName} className  = {f.selected.toString()} disabled = {f.selected} name = 'hardSkills' type = 'radio' >{f.skillName}</button>
      )
      })}
      </span>
      <p>{data.bio}</p>
     
    </div>
  )
}

export default ApplicantView