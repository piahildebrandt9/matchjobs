import React, { useState,useEffect } from "react";
import {useParams} from 'react-router-dom'
import axios from "axios";
import { URL } from "../config";


const Edit = ({type,id, userid})=>{
    const [loadData, setLoadData] = useState('') // loadData as a state variable so it can be filled with the right infos depending on the condition met
    const [initData, setInitData] = useState('') // what we get in the beginning
    const handleSubmit= async()=>{
        // call the backend and submit infos - only using loadData and update model chosen

        // controller updateJobApp/JobOffer
        try {
            if (type==='recruiter'){
                await axios.post(`/${URL}/recruiter/updateJobOffer`,{jobOffer:loadData ,oldJobOffer:initData} ) // set load and init to corresponding keys // pass the key/value as an object
            }else{
                await axios.post(`/${URL}/applicant/updateJobApplication`,{jobApp:loadData ,oldJobApp:initData} )
            }
        } catch (error) {
            console.log(error)
        }
    }

    const exist = async () =>{
        try{
            if(id){
                // loading data
                if (type === 'recuiter'){
                    let temp = await axios.get(`/${URL}/recruiter/getJobOffer/${id}`) // want the specific joboffer 
                    setInitData(temp)// CALLING THE FUNCTION
                }else{
                    let temp = await axios.get(`/${URL}/applicant/getJobApplication/${id}`) // want the specific joboffer 
                    setInitData(temp)
                }
            }else{
                //create
                //add new job Offer or job app
                if (type === 'recuiter'){
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
                    const addJobOffer = await axios.post(`/${URL}/recruiter/addJobOffer`,temp) // its a post so giving infos (temp)
                    // take the new received id (from the creation) and assign it to the new joboffer id
                    id = addJobOffer._id
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
                    const addJobApplication = await axios.post(`/${URL}/applicant/addJobApplication`,temp) // its a post so giving infos (temp)
                    id = addJobApplication._id
                }
            }
            // put data assigned to initData inside Load (allows us to recreate old/new data scheme of update controller)
            setLoadData(initData)
        }catch(error){
            console.log(error)
        }
    }

    useEffect(()=>{
        exist();
    })

    return(
        <>
        {/* // rendering keys of the loadData object */}
            <h1>Title</h1>
            <input type = 'text' placeholder = {loadData.jobTitle}/>
            {/* // display only if type is recruiter */}
            {type==='recruiter' && <input type = 'text' placeholder = {loadData.companyName}/>} 
            <input type = 'text' placeholder = {loadData.location}/>

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
            <input type = 'text' placeholder = {loadData.bio}/>
            <button onClick={handleSubmit}>submit</button>

        </>


    )

}

export default Edit