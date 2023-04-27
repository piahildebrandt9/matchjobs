import { URL } from "../config";
import axios from 'axios'



 const setUp = async (id,setIdx,setData,setMsg,data)=>{
    
    // if id given load data from data base and put it to inputs
    // id given
    if(id!= 'null'){
      // get existing data for this jobOffer(id) from db
      const getData = await axios.get(`${URL}/recruiter/getJobOffer/${id}`)
      
      if(getData.data.ok){
        // set the idx to the currently selected jobField
        let id = getData.data.data.jobOffer.jobFields.findIndex(c => c.selected == true)
        if(id !== -1){
          setIdx(id)
        }
        setData(getData.data.data.jobOffer)
      }
      else{
        setMsg(getData.data.data)
      }

    }
    else{
    // id not given
    // set default data into inputs
    // get all keys from data
    //setUpJobFields
    setUpJobFields(data,setData);
      const temp = Object.keys(data)
    // set corresponding input to the data
      for(var item of temp){
        if(document.getElementById(item)){
          document.getElementById(item).value = data[item]
        } 
      }

    }

  }


  
  const setUpJobFields = async (data,setData)=>{
    // setUp jobFields
     const getJobFields = await axios.get(`${URL}/admin/getAllJobFields`); 
    
    // get only jobField Names
    const jobFieldNames = getJobFields.data.data.map(c => c.jobFieldName)
    // make new array with objects of type[{jobFieldName:'',selected:true}]
    const fullJobField = [];
    for(var item of jobFieldNames){
      fullJobField.push({jobFieldName:item,selected:false})
    }
   
    // set up softSkills
    const softSkillsArray = getJobFields.data.data.map(c => c.softSkills) // [[skill1,skill2,...],[skilla,skillb,...]]
    const fullSoftSkillData = softSkillsArray.map(c => {
      let temp =[]
      for(var item of c){
        
        temp.push({skillName:item,selected:false})
      }
      return temp
  })
  
    // set up hardSkills
    const hardSkillsArray = getJobFields.data.data.map(c => c.hardSkills) // [[skill1,skill2,...],[skilla,skillb,...]]
    const fullHardSkillData = hardSkillsArray.map(c => {
      let temp =[]
      for(var item of c){
        
        temp.push({skillName:item,selected:false})
      }
      return temp
  })
  
   // save skills to data
    setData({...data,jobFields:fullJobField,softSkills:fullSoftSkillData,hardSkills:fullHardSkillData})
  }


  export {setUp}