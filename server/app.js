const express = require('express'),
  app= express(),
  mongoose = require('mongoose');
  // check schemas or give error
  mongoose.set('debug', true)
  
  app.use(express.urlencoded({extended:true}))
  app.use(express.json())

  async function connecting(){
try {
  await mongoose.connect('mongodb://79.155.82.168/matchjobs')
  console.log('Connected to the database')
} catch (error) {
  console.log('ERROR : Seems like your DB is not running')
}
}
connecting()

app.use('/recruiter/', require('./routes/recruitersRoutes'))
app.use('/applicants/', require('./routes/applicantsRoutes'))
app.use('/admin/', require('./routes/adminRoutes'))
app.listen(5555, ()=>console.log('listening on port 5555'))



