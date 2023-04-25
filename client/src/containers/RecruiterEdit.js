
import React, { useState,useEffect } from "react";
import {useParams, useNavigate} from 'react-router-dom'
import axios from "axios";
import { URL } from "../config";



function RecruiterEdit() {
  
  let {id,userid} = useParams(); //id = jobOfferId, userid = recruiters Id

  const[data, setData] = useState({companyName:'Your companyName',jobTitle:'Your job Title',remote:false,onSite:false,flexible:false,minPrice:0,maxPrice:Infinity,location:'put your location here',jobDescription:'describe the job',softSkills:[],hardSkills:[],jobFields:[],likedBy:[],recruitersId:userid})
  const[msg,setMsg] = useState('')
  
  const navigate = useNavigate();

  const submit = async ()=>{
    // if id given then update, else add
    
    if(id!='null'){
      //update
      const update = await axios.post(`${URL}/recruiter/updateJobOffer`,{jobOffer:data,oldJobOfferId:id})
      setMsg(update.data.data)
    }
    else{
      //add
      const add = await axios.post(`${URL}/recruiter/addJobOffer`,{jobOffer:data}) 
      
      id = add.data.data.jobOffer._id;
      
      if(add.data.ok){
        setMsg('successfully added jobOffer')
      }
    }
    navigate(`/recruiter/view/${id}/${userid}`)
  }

  const change = (e)=>{
    // set data to current input values
    setData({...data,[e.target.id]:e.target.value})

  }

  const setUp = async ()=>{
    // setUp jobFields
    const getJobFields = await axios.get(`${URL}/admin/getAllJobFields`);
    console.log('jbFields:',getJobFields)
    const jobFieldNames = getJobFields.data.data.map(c => c.jobFieldName)
    console.log(jobFieldNames)
    const fullJobField = [];
    for(var item of jobFieldNames){
      fullJobField.push({jobFieldName:item,selected:false})
    }
    setData({...data,jobFields:fullJobField})

    // if id given load data from data base and put it to inputs
    if(id!= 'null'){
      const getData = await axios.get(`${URL}/recruiter/getJobOffer/${id}`)
      
      if(getData.data.ok){
        setData(getData.data.data.jobOffer)
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

  const setJobField = (c,idx)=>{
    const temp = [data.jobFields];
    temp[idx].selected = !temp[idx].selected;


  
    setData({...data,jobFields:temp})

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
      <h1>Company Name</h1>
      <input id ='companyName' onChange = {(e) =>change(e)}/>
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
      {data.jobFields.map((c,idx) =>{
        return(
          <button  disabled = {c.selected} name = 'jobField'  type = 'radio' onClick = {()=>setJobField(c,idx)} >{c.jobFieldName} </button>
        )
        }
        )}
      
      <h3>Soft</h3>
      <h3>Hard</h3>
      <h1>Job Description</h1>
      <input id = 'jobDescription' onChange = {(e) =>change(e)}/>

      <button onClick = {submit}>submit</button>
      <p>{msg}</p>

    </div>
  )
}

export default RecruiterEdit