
import React, { useState,useEffect } from "react";
import {useParams, useNavigate} from 'react-router-dom'
import axios from "axios";
import { URL } from "../config";



function ApplicantEdit() {
  // params /:id/:userid
  let {id,userid} = useParams(); //id = jobApplicantId, userid = applicants Id
  // state variables
  const[data, setData] = useState({jobTitle:'Your job Title',remote:false,onSite:false,flexible:false,minPrice:0,maxPrice:Infinity,location:'put your location here',bio:'describe yourself',softSkills:[],hardSkills:[],jobFields:[],likedBy:[],applicantsId:userid})
  // default data when adding a new job Application
  const[msg,setMsg] = useState('') // msg displayed at the end confirming editing
  // useNavigate
  const navigate = useNavigate();

 


  const setUp = async ()=>{

    // setUp JobFields

    // make new jobFields input to be of type[{jobFieldName:'',selected:true}]
    // get all jobFields from db
    const getJobFields = await axios.get(`${URL}/admin/getAllJobFields`); 
    // get only jobField Names
    const jobFieldNames = getJobFields.data.data.map(c => c.jobFieldName)
    // make new array with objects of type[{jobFieldName:'',selected:true}]
    const fullJobField = [];
    for(var item of jobFieldNames){
      fullJobField.push({jobFieldName:item,selected:false})
    }
    
    setData({...data,jobFields:fullJobField}) //fullJobField = [{jobFieldName:'',selected:true}]


    // if id given load data from data base and put it to inputs
    // id given
    if(id!= 'null'){
      const getData = await axios.get(`${URL}/applicant/getJobApplication/${id}`)
      
      if(getData.data.ok){
        
        setData(getData.data.data.jobApp)
      }
      else{
        setMsg(getData.data.data)
      }

    }
    else{
    // id not given
    // set default data into inputs
    // get all jkeys from data
      const temp = Object.keys(data)
      // set corresponding input to the data
      for(var item of temp){
        if(document.getElementById(item)){
          document.getElementById(item).value = data[item]
        } 
      }

    }
    

  }

    // constantly setData to current input vlaues
  const changeData = (e)=>{
    // set data to current input values
    setData({...data,[e.target.id]:e.target.value})
  }


    // when button of JobField pushed change the selected value in state data
  const setJobField = (c,idx)=>{
    // make new array of jobFields
    const temp = [data.jobFields];
    // change selected status in array and in button
    temp[idx].selected = !temp[idx].selected;
    c.selected = !c.selected;

    // update data jobFields to new array
    setData({...data,jobFields:temp})

  }

   // in the end save changes to db
  const submit = async ()=>{

    // if id given then update, else add
    // id given
    if(id!='null'){
      //update
      const update = await axios.post(`${URL}/applicant/updateJobApplication`,{jobApplication:data,oldJobApplicationId:id})
      setMsg(update.data.data)
    }
    else{
      // id not given
      //add
      const add = await axios.post(`${URL}/applicant/addApplication`,{jobApplication:data}) 
      
      // set current id to the newly created job Applications id
      id = add.data.data;
 
      if(add.data.ok){
        setMsg('successfully added jobApplication')
      }
    }
    // switch render to view
    navigate(`/applicant/view/${id}`)
  }
 

  useEffect(()=>{
    // when initialize rendering setUp data
    setUp()
  },[])


  


    return (
    <div>
      
      <h1>Add your job offer</h1>
      <h1>Job Title</h1>
      <input id = 'jobTitle' value={data['jobTitle']} onChange = {(e) =>changeData(e)}/>
    
      {/* <button onClick={}> remote</button>
      <button onClick={}>on site</button>
      <button onClick={}>flexible</button> */}
      <p>location</p>
      <input id = 'location' value={data['location']} onChange = {(e) =>changeData(e)}/>
      {/* <input type = 'range' min = '0' max ='20 000' /> */}
      <p>min salary</p>
      <input id = 'minPrice' value = {data['minPrice']} onChange = {(e) =>changeData(e)}/>
      <p>max salary</p>
      <input id = 'maxPrice' value = {data['maxPrice']} onChange = {(e) =>changeData(e)}/>
      <h2>Skills</h2>
      <p>job Field</p>
      {data.jobFields.map((c,idx) =>{
        return(
          <button  disabled = {c.selected}  name = 'jobField'  type = 'radio' onClick = {()=>setJobField(c,idx)} >{c.jobFieldName}</button>
          
        )
        }
        )}
      
      <h3>Soft</h3>
      <h3>Hard</h3>
      <h1>Bio</h1>
      <input id = 'bio' value = {data['bio']} onChange = {(e) =>changeData(e)}/>

      <button onClick = {submit}>submit</button>
      <p>{msg}</p>

    </div>
  )
}

export default ApplicantEdit