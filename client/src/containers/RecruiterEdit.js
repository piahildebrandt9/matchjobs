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

  
  const fromSlider = document.getElementById('#fromSlider');
  const toSlider = document.getElementById('#toSlider');
  const fromInput = document.getElementById('#fromInput');
  const toInput = document.getElementById('#toInput');
  fillSlider(fromSlider, toSlider, '#C6C6C6', '#25daa5', toSlider);
  setToggleAccessible(toSlider);

  fromSlider.oninput = () => controlFromSlider(fromSlider, toSlider, fromInput);
  toSlider.oninput = () => controlToSlider(fromSlider, toSlider, toInput);
  fromInput.oninput = () => controlFromInput(fromSlider, fromInput, toInput, toSlider);
  toInput.oninput = () => controlToInput(toSlider, fromInput, toInput, toSlider);


        function controlFromInput(fromSlider, fromInput, toInput, controlSlider) {
          const [from, to] = getParsed(fromInput, toInput);
          fillSlider(fromInput, toInput, '#C6C6C6', '#25daa5', controlSlider);
          if (from > to) {
              fromSlider.value = to;
              fromInput.value = to;
          } else {
              fromSlider.value = from;
          }
      }
          
      function controlToInput(toSlider, fromInput, toInput, controlSlider) {
          const [from, to] = getParsed(fromInput, toInput);
          fillSlider(fromInput, toInput, '#C6C6C6', '#25daa5', controlSlider);
          setToggleAccessible(toInput);
          if (from <= to) {
              toSlider.value = to;
              toInput.value = to;
          } else {
              toInput.value = from;
          }
      }

      function controlFromSlider(fromSlider, toSlider, fromInput) {
        const [from, to] = getParsed(fromSlider, toSlider);
        fillSlider(fromSlider, toSlider, '#C6C6C6', '#25daa5', toSlider);
        if (from > to) {
          fromSlider.value = to;
          fromInput.value = to;
        } else {
          fromInput.value = from;
        }
      }

      function controlToSlider(fromSlider, toSlider, toInput) {
        const [from, to] = getParsed(fromSlider, toSlider);
        fillSlider(fromSlider, toSlider, '#C6C6C6', '#25daa5', toSlider);
        setToggleAccessible(toSlider);
        if (from <= to) {
          toSlider.value = to;
          toInput.value = to;
        } else {
          toInput.value = from;
          toSlider.value = from;
        }
      }

      function getParsed(currentFrom, currentTo) {
        const from = parseInt(currentFrom.value, 10);
        const to = parseInt(currentTo.value, 10);
        return [from, to];
      }

      function fillSlider(from, to, sliderColor, rangeColor, controlSlider) {
        console.log(from,to,controlSlider)
          const rangeDistance = to.max - 0;
          const fromPosition = 10 - 0;
          const toPosition = 40 - 0;
          controlSlider.style.background = `linear-gradient(
            to right,
            ${sliderColor} 0%,
            ${sliderColor} ${(fromPosition)/(rangeDistance)*100}%,
            ${rangeColor} ${((fromPosition)/(rangeDistance))*100}%,
            ${rangeColor} ${(toPosition)/(rangeDistance)*100}%, 
            ${sliderColor} ${(toPosition)/(rangeDistance)*100}%, 
            ${sliderColor} 100%)`;
      }

      function setToggleAccessible(currentTarget) {
        const toSlider = document.querySelector('#toSlider');
        if (Number(currentTarget.value) <= 0 ) {
          toSlider.style.zIndex = 2;
        } else {
          toSlider.style.zIndex = 0;
        }
      }


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
      <div className = 'range_container'>
        <div className = 'sliders_control'>
          <input id="fromSlider"  type="range"  min='0' max='100' defaultValue = '10' />
          <input id="toSlider"  type="range"  min='0' max='100' defaultValue = '40' />
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