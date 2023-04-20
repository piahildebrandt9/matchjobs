import React, { useState,useEffect } from "react";
import {useParams} from 'react-router-dom'
import axios from "axios";
import { URL } from "../config";

function View() {

  // taking type and id params and use them as props
  const {type,id} = useParams()
  const [data, setData]= useState('')

  // load from the backend infos of sheet (using id)
  // using a loadData function to fetch data of offer/app from backend
  const loadData=async()=>{
    if (type==='recruiter'){
      const temp = await axios.get(`/${URL}/recruiter/getJobOffer/?id=${id}`)
      setData(temp)
    }else{
      const temp = await axios.get(`/${URL}/applicant/getJobApplication/?id=${id}`) 
      setData(temp)
    }
  }
// render the app/offer on the front end
  useEffect(()=>{
    loadData()
})

    return(
      <>
      {/* // rendering keys of the loadData object */}
          <h1>{data.jobTitle}</h1>
          {/* // if recruiter condition is met */}
          {type==='recruiter' && <h2>{data.companyName}</h2>} 
          <p>{data.location}</p>
          <button> remote</button>
          <button>on site</button>
          <button>flexible</button>
          <input type = 'range' min = '0' max ='20 000' />
          <h1>Skills</h1>
          <p>Soft</p>
          <p>Hard</p>
          {type ==='recruiter' ? <h1>Job Description</h1>: <h1>Biographie</h1>}
          {type ==='recruiter' ? <p>{data.jobDescription}</p> : <p>{data.bio}</p>}
        </>
  )
}

export default View