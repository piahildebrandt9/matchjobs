
import React, { useState,useEffect } from "react";
import {useParams, useNavigate} from 'react-router-dom'
import axios from "axios";
import { URL } from "../config";
import Skills from '../components/Skills'
import {setUp} from '../functions/setUpApplicantEdit'




function ApplicantEdit() {
  // params /:id/:userid
  let {id,userid} = useParams(); //id = jobApplicantId, userid = applicants Id

  // state variables
  const[data, setData] = useState({jobTitle:'Your job Title',remote:false,onSite:false,flexible:false,minPrice:0,maxPrice:Infinity,location:'put your location here',bio:'describe yourself',softSkills:[['set JobField']],hardSkills:[['setJobField']],jobFields:[],likedBy:[],applicantsId:userid})
  // default data when adding a new job Application
  const [idx,setIdx] = useState("")// idx of the choosen jobField
  const[msg,setMsg] = useState('') // msg displayed at the end confirming editing

  // useNavigate
  const navigate = useNavigate();

 


  // const setUp = async ()=>{

  //   // if id given load data from data base and put it to inputs
  //   // id given
  //   if(id!= 'null'){
  //     // get existing data for jobApplication (id) from db
  //     const getData = await axios.get(`${URL}/applicant/getJobApplication/${id}`)
      
  //     if(getData.data.ok){
  //       // set the idx to the currently selected jobField
  //       let id = getData.data.data.jobApp.jobFields.findIndex(c => c.selected == true)
  //       if(id !== -1){
  //         setIdx(id)
  //       }
  //       setData(getData.data.data.jobApp)
  //     }
  //     else{
  //       setMsg(getData.data.data)
  //     }

  //   }
  //   else{
  //   // id not given
  //   // set default data into inputs
  //   // get all jkeys from data
  //   // setUpJobFields
  //   setUpJobFields(data,setData);

  //     const temp = Object.keys(data)
  //     // set corresponding input to the data
  //     for(var item of temp){
  //       if(document.getElementById(item)){
  //         document.getElementById(item).value = data[item]
  //       } 
  //     }

  //   }
    

  // }


  //   const setUpJobFields = async ()=>{
  //     // setUp jobFields
  //     const getJobFields = await axios.get(`${URL}/admin/getAllJobFields`); 
    
  //     // get only jobField Names
  //     const jobFieldNames = getJobFields.data.data.map(c => c.jobFieldName)
  //     // make new array with objects of type[{jobFieldName:'',selected:true}]
  //     const fullJobField = [];
  //     for(var item of jobFieldNames){
  //       fullJobField.push({jobFieldName:item,selected:false})
  //     }
     
  //     // set up softSkills
  //     const softSkillsArray = getJobFields.data.data.map(c => c.softSkills) // [[skill1,skill2,...],[skilla,skillb,...]]
  //     const fullSoftSkillData = softSkillsArray.map(c => {
  //       let temp =[]
  //       for(var item of c){
          
  //         temp.push({skillName:item,selected:false})
  //       }
  //       return temp
  //   })
    
  //     // set up hardSkills
  //     const hardSkillsArray = getJobFields.data.data.map(c => c.hardSkills) // [[skill1,skill2,...],[skilla,skillb,...]]
  //     const fullHardSkillData = hardSkillsArray.map(c => {
  //       let temp =[]
  //       for(var item of c){
          
  //         temp.push({skillName:item,selected:false})
  //       }
  //       return temp
  //   })
    
  //    // save skills to data
  //     setData({...data,jobFields:fullJobField,softSkills:fullSoftSkillData,hardSkills:fullHardSkillData})
  //   }



    // constantly setData to current input vlaues
  const changeData = (e)=>{
    // set data to current input values
    setData({...data,[e.target.id]:e.target.value})
  }


    // when button of JobField pushed change the selected value in state data
  const setJobField = (c,idx)=>{
    // make new array of jobFields
    let temp = [...data.jobFields];
    temp = temp.map(d =>({...d,selected:false}))
    // change selected status in array and in button
    temp[idx].selected = true;
    // c.selected = !c.selected;

    // update data jobFields to new array
    setData({...data,jobFields:temp})
    // set idx of the current select jobField
    setIdx(idx)

  }

  
  // change value of soft skill when you click on it
  const setSoftSkill = (c,id)=>{
    // make copy of all softSkill
    let tempSoftSkills = [...data.softSkills]
    // make copy of all softSkills belonging to the currently selected jobField
    let temp = [...data.softSkills[idx]];
    // change selection value to true
    temp[id].selected = true;
    // replace in array of all SoftSkills
    tempSoftSkills[idx] = temp
    // update Data
    setData({...data,softSkills:tempSoftSkills})

  }

  const setHardSkill = (c,id)=>{
    // make copy of all hardSkills
    let tempHardSkills = [...data.hardSkills]
    // make copy of all hardSkillsl belonging to the currently selected jobField
    let temp = [...data.hardSkills[idx]];
    //change selection of value to true
    temp[id].selected = true;
    // replace array of all HardSKills
    tempHardSkills[idx] = temp
    // update data
    setData({...data,hardSkills:tempHardSkills})

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
 
    setUp(id,setIdx,setData,setMsg,data)
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
     <Skills idx = {idx} data= {data} setJobField  ={setJobField} setSoftSkill= {setSoftSkill} setHardSkill = {setHardSkill} />
      <h1>Bio</h1>
      <input id = 'bio' value = {data['bio']} onChange = {(e) =>changeData(e)}/>

      <button onClick = {submit}>submit</button>
      <p>{msg}</p>

    </div>
  )
}

export default ApplicantEdit