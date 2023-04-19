import React, { useState,useEffect } from "react";

import {useParams} from 'react-router-dom'
import axios from "axios";
import { URL } from "../config";


const Edit = ({type,id})=>{
    

    const exist = async () =>{
        try{
            if(id){
                // loading data
                const loadData = await axios.post('')
    
    
            }
            else{
                //create
                //add new job Offer or job app
    
            }

        }catch(error){

        }
      

    }

    useEffect(()=>{
        exist();

    },[])


    return(
        
        <>
            <h1>Title</h1>
            <input type = 'text' placeholder = { type === 'recruiter'? 'Job Title' : 'Application Title'}/>
            <input type = 'text' placeholder = 'location'/>
            <button>remote</button>
            <button>on site</button>
            <button>flexible</button>
            <input type = 'range' min = '0' max ='20 000' />

            <h1>Skills</h1>
            <p>Soft</p>
            <p>Hard</p>
            {type ==='recruiter' ? <h1>Job Description</h1>: <h1>Biographie</h1>}
            <input type = 'text' placeholder = 'hello, I am ...'/>
            <button onClick>submit</button>





        
      
        </>


    )

}

export default Edit