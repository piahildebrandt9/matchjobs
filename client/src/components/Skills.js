import React from 'react'

function Skills({idx,data,setJobField,setSoftSkill,setHardSkill}) {
  return (
    <p>
          {data.jobFields.map((c,id) =>{
        return(
          <button  disabled = {c.selected}  name = 'jobField'  type = 'radio' onClick = {()=>setJobField(c,id)} >{c.jobFieldName}</button>
          
        )
        }
        )}
      
      <h3>Soft</h3>
      
      {idx !== "" && data.softSkills[idx].map((c,id)=>{
        return (
          <button disabled = {c.selected} name = 'softSkills' type = 'radio' onClick = {()=>setSoftSkill(c,id)}>{c.skillName}</button>
        )
      })}
      <h3>Hard</h3>
      {idx !== "" && data.hardSkills[idx].map((c,id)=>{
        return (
          <button disabled = {c.selected} name = 'hardSkills' type = 'radio' onClick = {()=>setHardSkill(c,id)}>{c.skillName}</button>
        )
      })}

    </p>
  )
}

export default Skills