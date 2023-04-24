
import React, { useState,useEffect } from "react";
import {useParams, useNavigate} from 'react-router-dom'
import axios from "axios";
import { URL } from "../config";



function ApplicantEdit() {
  
  let {id,userid} = useParams(); //id = jobApplicantId, userid = applicants Id

  const[data, setData] = useState({jobTitle:'Your job Title',remote:false,onSite:false,flexible:false,minPrice:0,maxPrice:Infinity,location:'put your location here',bio:'describe yourself',softSkills:[],hardSkills:[],jobFields:[],likedBy:[],applicantsId:userid})
  const[msg,setMsg] = useState('')
  
  const navigate = useNavigate();

  const submit = async ()=>{
    // if id given then update, else add
    
    if(id!='null'){
      //update
      const update = await axios.post(`${URL}/applicant/updateJobApplication`,{jobApplication:data,oldJobApplicationId:id})
      setMsg(update.data.data)
    }
    else{
      //add
      const add = await axios.post(`${URL}/applicant/addApplication`,{jobApplication:data}) 
      
      id = add.data.data.jobApplication._id;
      console.log(id)
      if(add.data.ok){
        setMsg('successfully added jobApplication')
      }
    }
    navigate(`/applicant/view/${id}/${userid}`)
  }

  const change = (e)=>{
    // set data to current input values
    setData({...data,[e.target.id]:e.target.value})

  }

  const setUp = async ()=>{
    // if id given load data from data base and put it to inputs
    if(id!= 'null'){
      const getData = await axios.get(`${URL}/applicant/getJobApplication/${id}`)
      
      if(getData.data.ok){
        setData(getData.data.data.jobApplication)
      }
      else{
        setMsg(getData.data.data)
      }

    }
    else{
    //else (id not given) set default data into inputs
      const temp = Object.keys(data)
      for(var item of temp){
        if(document.getElementById(item)){
          document.getElementById(item).value = data[item]
        } 
      }

    }
    

  }
  const setInputs = ()=>{
    // every time data changes set input values to data
    const arr = Object.keys(data);
        
        for(var item of arr){
          if(document.getElementById(item)){
            document.getElementById(item).value = data[item]
          } 
        }

  }

  useEffect(()=>{
    // when initialize rendering setUp data
    setUp()
  },[])

  useEffect(()=>{
    // every time data changes input values to data
    setInputs();
  },[data])
  


    return (
    <div>
      
      <h1>Add your job offer</h1>
      <h1>Job Title</h1>
      <input id = 'jobTitle' onChange = {(e) =>change(e)}/>
    
      {/* <button onClick={}> remote</button>
      <button onClick={}>on site</button>
      <button onClick={}>flexible</button> */}
      <p>location</p>
      <input id = 'location' onChange = {(e) =>change(e)}/>
      {/* <input type = 'range' min = '0' max ='20 000' /> */}
      <p>min salary</p>
      <input id = 'minPrice' onChange = {(e) =>change(e)}/>
      <p>max salary</p>
      <input id = 'maxPrice' onChange = {(e) =>change(e)}/>
      <h2>Skills</h2>
      <p>job Field</p>
      <h3>Soft</h3>
      <h3>Hard</h3>
      <h1>Bio</h1>
      <input id = 'bio' onChange = {(e) =>change(e)}/>

      <button onClick = {submit}>submit</button>
      <p>{msg}</p>

    </div>
  )
}

export default ApplicantEdit