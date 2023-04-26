import React, { useState,useEffect } from "react";
import {useParams, useNavigate} from 'react-router-dom'
import axios from "axios";
import { URL } from "../config";



function RecruiterEdit() {
  // params /:id /:userid
  let {id,userid} = useParams(); //id = jobOfferId, userid = recruiters Id
  // state variables
  const[data, setData] = useState({companyName:'Your companyName',jobTitle:'Your job Title',remote:false,onSite:false,flexible:false,minPrice:0,maxPrice:Infinity,location:'put your location here',jobDescription:'describe the job',softSkills:[],hardSkills:[],jobFields:[],likedBy:[],recruitersId:userid})
  // data = empty new job offer
  const[softSkills,setSoftSkills] = useState([]);
  const[hardSkills,setHardSkills] = useState([])
  const[msg,setMsg] = useState('') // msg displayed in the end, declaring status of edit
  // useNavigate
  const navigate = useNavigate();

 
  // const setUp = async ()=>{
    
  //   // if id given load data from data base and put it to inputs
  //   // id given
  //   if(id!= 'null'){
  //     // get existing data for this jobOffer(id) from db
  //     const getData = await axios.get(`${URL}/recruiter/getJobOffer/${id}`)
      
  //     if(getData.data.ok){
  //       setData(getData.data.data.jobOffer)
  //     }
  //     else{
  //       setMsg(getData.data.data)
  //     }

  //   }
  //   else{
  //   // id not given
  //   // set default data into inputs
  //   // get all keys from data
  //     const temp = Object.keys(data)
  //   // set corresponding input to the data
  //     for(var item of temp){
  //       if(document.getElementById(item)){
  //         document.getElementById(item).value = data[item]
  //       } 
  //     }

  //   }

    

    

  // }

  const setUpJobFields = async ()=>{

    
    // setUp jobFields

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
   
   const arr = ['bla']
  
    setData({...data,jobFields:['blarz']}) //fullJobField = [{jobFieldName:'',selected:true}, {...}]
   

    const softSkillsArray = getJobFields.data.data.map(c => c.softSkills) // [[skill1,skill2,...],[skilla,skillb,...]]
    const fullSoftSkillData = softSkillsArray.map(c => {
      let temp =[]
      for(var item of c){
        
        temp.push({skillName:item,selected:false})
      }
      return temp
  })
  
    setData({...data,softSkills:fullSoftSkillData})

    
    const hardSkillsArray = getJobFields.data.data.map(c => c.hardSkills) // [[skill1,skill2,...],[skilla,skillb,...]]
    const fullHardSkillData = hardSkillsArray.map(c => {
      let temp =[]
      for(var item of c){
        
        temp.push({skillName:item,selected:false})
      }
      return temp
  })
  
    setData({...data,hardSkills:fullHardSkillData})


  }

  // constantly updating data to current input values
  const changeData = (e)=>{
    // set data to current input values
    // setData({...data,[e.target.id]:e.target.value})
    
    

  }
 
  // when button of JobField pushed change the selected value in state data
  const setJobField = (c,idx)=>{
    // // make new array of jobFields
    // const temp = [data.jobFields];
    // // change selected status in array and in button
    // temp[idx].selected = !temp[idx].selected;
    // c.selected = !c.selected;

    // // update data jobFields to new array
    // setData({...data,jobFields:temp})



  }

   // in the end update or add final changes to database
   const submit = async ()=>{

    // if id given then update, else add
    if(id!='null'){
      //update
      const update = await axios.post(`${URL}/recruiter/updateJobOffer`,{jobOffer:data,oldJobOfferId:id})
      setMsg(update.data.data)
    }
    else{
      //add
      console.log('data:',data)
      const add = await axios.post(`${URL}/recruiter/addJobOffer`,{jobOffer:data}) 
      console.log('add:',add)

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
    // setUp();
    setUpJobFields();
  
  },[])


  // useEffect(()=>{

  //   setUpJobFields();
  // },[data])

 


    return (
    <div>
      
      <h1>Add your job offer</h1>
      <h1>Job Title</h1>
      <input id = 'jobTitle' value = {data['jobTitle'] } onChange = {(e) =>changeData(e)}/>
      <h1>Company Name</h1>
      <input id ='companyName' value = {data['companyName'] } onChange = {(e) =>changeData(e)}/>
      {/* <button onClick={}> remote</button>
      <button onClick={}>on site</button>
      <button onClick={}>flexible</button> */}
      <p>location</p>
      <input id = 'location' value = {data['location']} onChange = {(e) =>changeData(e)}/>
      {/* <input type = 'range' min = '0' max ='20 000' /> */}
      <p>min salary</p>
      <input id = 'minPrice' value = {data['minPrice'] } onChange = {(e) =>changeData(e)}/>
      <p>max salary</p>
      <input id = 'maxPrice' value = {data['maxPrice'] } onChange = {(e) =>changeData(e)}/>
      <h2>Skills</h2>
      <p>job Field</p>
      {data.jobFields.map((c,idx) =>{
        return(
          <button  disabled = {c.selected}  name = 'jobField'  type = 'radio' onClick = {()=>setJobField(c,idx)} >{c.jobFieldName}</button>
          
        )
        }
        )}
      
      <h3>Soft</h3>
      {/* {data.softSkills.map((c,idx)=>{
        return (
          <button disabled = {} name = 'softSkills' type = 'radio'></button>
        )
      })} */}
      <h3>Hard</h3>
      <h1>Job Description</h1>
      <input id = 'jobDescription' value = {data['jobDescription'] } onChange = {(e) =>changeData(e)}/>

      <button onClick = {submit}>submit</button>
      <p>{msg}</p>

    </div>
  )
}

export default RecruiterEdit