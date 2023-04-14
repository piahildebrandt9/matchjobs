const express = require('express'),
  app= express(),
  mongoose = require('mongoose');
  // check schemas or give error
  mongoose.set('debug', true)
  require('dotenv').config();
  
  app.use(express.urlencoded({extended:true}))
  app.use(express.json())
  app.use(require('cors')())

  async function connecting(){
try {
  await mongoose.connect(process.env.MONGO)
  console.log('Connected to the database')
} catch (error) {
  console.log('ERROR : Seems like your DB is not running')
}
}
connecting()

// app.use('/recruiter/', require('./routes/recruitersRoutes'));
// app.use('/applicants/', require('./routes/applicantsRoutes'));
app.use('/admin/', require('./routes/adminRoutes'));
app.listen(5555, ()=>console.log('listening on port 5555'));



