
import React, { useState,useEffect } from "react";
import {useParams, useNavigate} from 'react-router-dom'
import axios from "axios";
import { URL } from "../config";

function ApplicantView() {
  // params /:id
  const {id} = useParams(); // id = id of the jobApplication, userid = id of the applicant
  // state variables
  const [data,setData] = useState({jobTitle:'',remote:false,onSite:false,flexible:false,minPrice:0,maxPrice:Infinity,location:'',bio:''});

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
      <p>job Field</p>
      <h3>Soft</h3>
      <h3>Hard</h3>
      <h1>{data.bio}</h1>
     
    </div>
  )
}

export default ApplicantView