import React from 'react'
import '../App.css'

function Skills({idx,data,setJobField,setSoftSkill,setHardSkill}) {
  return (
    <div>
          {data.jobFields.map((c,id) =>{
        return(
          <button className = {c.selected.toString()} key={id}  disabled = {c.selected}  name = 'jobField'  type = 'radio' onClick = {()=>setJobField(c,id)} >{c.jobFieldName}</button>
          
        )
        }
        )}
      
      <p>Soft</p>
      
      {idx !== "" && data.softSkills[idx].map((c,id)=>{
        return (
          <button className = {c.selected.toString()} key={id} disabled = {c.selected} name = 'softSkills' type = 'radio' onClick = {()=>setSoftSkill(c,id)}>{c.skillName}</button>
        )
      })}
      <p>Hard</p>
      {idx !== "" && data.hardSkills[idx].map((c,id)=>{
        return (
          <button className = {c.selected.toString()} key={id} disabled = {c.selected} name = 'hardSkills' type = 'radio' onClick = {()=>setHardSkill(c,id)}>{c.skillName}</button>
        )
      })}

    </div>
  )
}

export default Skills