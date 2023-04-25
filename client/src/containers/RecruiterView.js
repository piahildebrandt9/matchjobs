
import React, { useState,useEffect } from "react";
import {useParams, useNavigate} from 'react-router-dom'
import axios from "axios";
import { URL } from "../config";

function RecruiterView() {
  const {id} = useParams(); // id = id of the jobOffer, userid = id of the recruiter

  const [data,setData] = useState({companyName:'',jobTitle:'',remote:false,onSite:false,flexible:false,minPrice:0,maxPrice:Infinity,location:'',jobDescription:''});

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

  useEffect(()=>{

    loadData();

  },[])

  return (
    <div>
      
      <h1 >{data.jobTitle}</h1>
      <h1>{data.companyName}</h1>
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
      <h1>{data.jobDescription}</h1>
      {/* <button onClick = {()=> navigate(`/recruiter/profile/${userid}`)}>back to profile</button> */}

    </div>
  )
}

export default RecruiterView