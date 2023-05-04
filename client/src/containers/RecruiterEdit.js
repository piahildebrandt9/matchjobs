import React, { useState,useEffect } from "react";
import {useParams, useNavigate} from 'react-router-dom'
import axios from "axios";
import { URL } from "../config";
import Skills from '../components/Skills'
import {setUp} from '../functions/setUpRecruiterEdit'


function RecruiterEdit() {
  // params /:id /:userid
  let {id,userid} = useParams(); //id = jobOfferId, userid = recruiters Id

  // state variables
  const[data, setData] = useState({companyName:'Your companyName',jobTitle:'Your job Title',remote:false,onSite:false,flexible:false,minPrice:0,maxPrice:Infinity,location:'put your location here',jobDescription:'describe the job',softSkills:[['choose jobField']],hardSkills:[['choose jobField']],jobFields:[],likedBy:[],recruitersId:userid,active:false})
  // data = empty new job offer
  const [idx,setIdx] = useState("")// idx of the choosen jobField
  const[msg,setMsg] = useState('') // msg displayed in the end, declaring status of edit

  // useNavigate
  const navigate = useNavigate();

 
  

  // constantly updating data to current input values
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

  const changePrice =(e)=>{
    setData({...data,['minPrice']:e.target.min, ['maxPrice']:e.target.max})

  }

  const setValue = (e)=>{
    setData({...data,[e.target.name]: !data[e.target.name]});

  }


   // in the end update or add final changes to database
   const submit = async ()=>{
    console.log(data)
    // if id given then update, else add
    if(id!='null'){
      //update
      const update = await axios.post(`${URL}/recruiter/updateJobOffer`,{jobOffer:data,oldJobOfferId:id})
      setMsg(update.data.data)
    }
    else{
      //add
      // console.log('data:',data)
      const add = await axios.post(`${URL}/recruiter/addJobOffer`,{jobOffer:data}) 
      // console.log('add:',add)

      // change current id to the newly created jobOffers id
      id = add.data.data;
      
      if(add.data.ok){
        setMsg('successfully added jobOffer')
      }
    }
    navigate(`/recruiter/view/${id}`)
  }


  useEffect(()=>{
    // when initialize rendering setUp data
    setUp(id,setIdx,setData,setMsg,data)
    
    
  
  },[])



    return (
    <div className = 'sheet'>
      
      
      <p>Job Title</p>
      <input id = 'jobTitle' value = {data['jobTitle'] } onChange = {(e) =>changeData(e)}/>
      <p>Company Name</p>
      <input id ='companyName' value = {data['companyName'] } onChange = {(e) =>changeData(e)}/>
      <span>
      <button className = {data.remote.toString()}  name = 'remote' value = 'remote' type = 'radio' onClick = {(e) =>setValue(e)}>remote</button>
      <button className = {data.onSite.toString()}  name = 'onSite' value = 'onSite' type = 'radio' onClick = {(e) =>setValue(e)}>on site</button>
      <button className = {data.flexible.toString()}  name = 'flexible' value = 'flexible' type = 'radio' onClick = {(e) =>setValue(e)}>flexible</button>
      </span>
      <p>location</p>
      <input id = 'location' value = {data['location']} onChange = {(e) =>changeData(e)}/>
      <div className = 'range-container'>
        <div className = 'sliderscontrol'>
          <input id="slider-1"  type="range" step="500" min='0' max='10000' value = '500' />
          <input id="slider-2"  type="range" step="500" min='0' max='10000' value = '3000' />
        </div>
        <div className="form_control">
          <div className="form_control_container">
              <div className="form_control_container__time">Min</div>
              <input className="form_control_container__time__input" type="number" id="fromInput" value="10" min="0" max="100"/>
          </div>
          <div className="form_control_container">
              <div className="form_control_container__time">Max</div>
              <input className="form_control_container__time__input" type="number" id="toInput" value="40" min="0" max="100"/>
          </div>
        </div>
      </div>
      {/* <p>min salary</p>
      <input id = 'minPrice' value = {data['minPrice'] } onChange = {(e) =>changeData(e)}/>
      <p>max salary</p>
      <input id = 'maxPrice' value = {data['maxPrice'] } onChange = {(e) =>changeData(e)}/> */}
      <p>Skills</p>
      <p>job Field</p>
      <Skills idx = {idx} data= {data} setJobField  ={setJobField} setSoftSkill= {setSoftSkill} setHardSkill = {setHardSkill} />
      

      <p>Job Description</p>
      <textarea rows ="4"  id = 'jobDescription'  value = {data['jobDescription'] }  onChange = {(e) =>changeData(e)}/>

      <button id = 'button' onClick = {submit}>submit</button>
      <p>{msg}</p>

    </div>
  )
}

export default RecruiterEdit