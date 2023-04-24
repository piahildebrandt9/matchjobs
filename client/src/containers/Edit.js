import React, { useState,useEffect } from "react";
import {useParams} from 'react-router-dom'
import axios from "axios";
import { URL } from "../config";


const Edit = ()=>{
    //destructuring to extract the type, id, and userid parameters from the current route's URL
    // store them in individual variables.
    let {type,id,userid} = useParams();

    const [loadData, setLoadData] = useState({}) // loadData as a state variable so it can be filled with the right infos depending on the condition met
    const [initData, setInitData] = useState({}) // what we get in the beginning
    const [newID, setNewID]= useState(id)
  
    const handleSubmit= async()=>{
        // call the backend and submit infos - only using loadData and update model chosen

        // controller updateJobApp/JobOffer
        try {
            if (type==='recruiter'){
                console.log(loadData,initData)
                const data = await axios.post(`${URL}/recruiter/updateJobOffer`,{jobOffer:loadData,oldJobOffer:initData}) // set load and init to corresponding keys // pass the key/value as an object
            }else{
                await axios.post(`${URL}/applicant/updateJobApplication`,{jobApp:loadData ,oldJobApp:initData} )
            }
        } catch (error) {
            console.log(error)
        }}

    const exist = async () =>{
        try{
            if(newID!="null"){
            // console.log(id)
            // loading data
                if (type === 'recruiter'){
                    let temp = await axios.get(`${URL}/recruiter/getJobOffer/${id}`) // want the specific joboffer 
                    setInitData(temp)// CALLING THE FUNCTION
                }else{
                    let temp = await axios.get(`${URL}/applicant/getJobApplication/${id}`) // want the specific joboffer 
                    setInitData(temp)
                }
            }else{
                //create
                //add new job Offer or job app
         
                if (type === 'recruiter'){
                    let temp = {
                        companyName:'My company',
                        jobTitle:'Job Title',
                        remote:false,
                        onSite:false,
                        flexible:false,
                        minPrice:0,
                        maxPrice:Infinity,
                        location:'Barcelona',
                        jobDescription:'Describe your job here..',
                        softSkills:[],
                        hardSkills:[],
                        jobFields:[],
                        likedBy:[],
                        recruitersId:{userid},
                        active:false,
                    }
                    setInitData(temp)
                    const addJogyrtfbOffer = await axios.post(`${URL}/recruiter/addJobOffer`,temp) // its a post so giving infos (temp)
                    
                    // take the new received id (from the creation) and assign it to the new joboffer id
                    setNewID(addJobOffer._id)
                }else{
                    let temp= {
                        jobTitle:'Application title',
                        remote:false,
                        onSite:false,
                        flexible:false,
                        minPrice:0,
                        maxPrice:Infinity,
                        location:'Barcelona',
                        bio:'Describe yourself here..',
                        softSkills:[],
                        hardSkills:[],
                        jobFields:[],
                        uploadedFiles:[],
                        likedBy: [],
                        applicantsId:{userid},
                        active:false,
                    }
                    setInitData(temp)
                    const addJobApplication = await axios.post(`${URL}/applicant/addJobApplication`,temp) // its a post so giving infos (temp)
                    setNewID(addJobApplication._id)
                }
            }
            // put data assigned to initData inside Load (allows us to recreate old/new data scheme of update controller)
            setLoadData({...initData})
        }catch(error){
            console.log(error)
        }
    }

    useEffect(()=>{
        exist();
    },[])

    return(
        <>
        {/* // rendering keys of the loadData object */}
            <h1>Title</h1>
            {/* // [e.target.name] is the key in the schema of mongodb and we are assigning here the current value of that input to that key in loadData */}
            <input name = 'jobTitle' type = 'text' placeholder = {loadData.jobTitle} onChange = {(e) =>{setLoadData({...loadData,[e.target.name]:e.target.value})}}/>
            {/* // display only if type is recruiter */}
            {type==='recruiter' && <input name = 'companyName' type = 'text' placeholder = {loadData.companyName} onChange = {(e) =>{setLoadData({...loadData,[e.target.name]:e.target.value})}}/>} 
            <input name = 'location' type = 'text' placeholder = {loadData.location} onChange = {(e) =>{setLoadData({...loadData,[e.target.name]:e.target.value})}}/>

            {/* // we use on click to change the state of the button when clicked
            // inside the function we call the whole object and only change remote TO : the opposite of its current state (that is what ! stands for) */}
            <button onClick={()=>setLoadData({...loadData,remote:!loadData.remote})}> remote</button>
            <button onClick={()=>setLoadData({...loadData,onSite:!loadData.onSite})}>on site</button>
            <button onClick={()=>setLoadData({...loadData,flexible:!loadData.flexible})}>flexible</button>
            <input type = 'range' min = '0' max ='20 000' />

            <h1>Skills</h1>
            <p>Soft</p>
            <p>Hard</p>
            {type ==='recruiter' ? <h1>Job Description</h1>: <h1>Biographie</h1>}
           {type === 'recruiter' ?  <input name = 'jobDescription' type = 'text' placeholder = {loadData.jobDescription} onChange =  {(e) =>{setLoadData({...loadData,[e.target.name]:e.target.value})}} /> :
           <input name = 'bio' type = 'text' placeholder = {loadData.bio} onChange =  {(e) =>{setLoadData({...loadData,[e.target.name]:e.target.value})}} /> }
            <button onClick={handleSubmit}>submit</button>

        </>


    )

}

export default Edit