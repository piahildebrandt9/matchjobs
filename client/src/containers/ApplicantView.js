
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
    <div>
      
      <h1 >{data.jobTitle}</h1>
      
      {/* <button onClick={}> remote</button>
      <button onClick={}>on site</button>
      <button onClick={}>flexible</button> */}
      <p>{data.location}</p>
      <p>{data.minPrice}</p>
      <p>{data.maxPrice}</p>
      <h2>Skills</h2>
      {data.jobFields.map((d) =>{
        return(
          <button  disabled = {d.selected}  name = 'jobField'  type = 'radio'  >{d.jobFieldName}</button>
          
        )})}
        <h3>Soft</h3>
      {data.jobFields.findIndex(c => c.selected == true) !== -1 &&  data.softSkills[data.jobFields.findIndex(c => c.selected == true) ].map((e)=>{
      return (
        <button disabled = {e.selected} name = 'softSkills' type = 'radio' >{e.skillName}</button>
      )
      })} 
      {data.jobFields.findIndex(c => c.selected == true) !== -1 &&  data.hardSkills[data.jobFields.findIndex(c => c.selected == true) ].map((f)=>{
      return (
        <button disabled = {f.selected} name = 'hardSkills' type = 'radio' >{f.skillName}</button>
      )
      })}
      <h1>{data.bio}</h1>
     
    </div>
  )
}

export default ApplicantView