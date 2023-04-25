const express = require('express');
const router = express.Router();
const controller = require('../controllers/adminControllers')

router.post('/register', controller.register);
router.post('/login', controller.login);
router.post('/verify_token', controller.verify_token);


// findAdmins - log in
//works
router.post('/findAdmin', controller.findAdmin);
// Add an admin (not displayed on frontend)
//works
router.post('/addAdmin', controller.addAdmin);
// getAll (get all datas from recruiters)
router.get('/getAllRecruiters', controller.getAllRecruiters);
// // getAll (get all datas from applicants)
router.get('/getAllApplicants', controller.getAllApplicants);
// // deleteApplicants
router.post('/deleteApplicant', controller.deleteApplicant);
// //deleteRecruiters
router.post('/deleteRecruiter', controller.deleteRecruiter);
// //deleteJobOffers
router.post('/deleteOffers', controller.deleteOffer);
// //deleteJobApplications
router.post('/deleteApplications', controller.deleteApplication);

// getJobField
router.post('/addJobField',controller.addJobField)
router.post('/addSoftSkill',controller.addSoftSkill)
router.post('/addHardSkill',controller.addHardSkill)
router.get('/getAllJobFields',controller.getAllJobFields)
router.post('/getJobField',controller.getJobField)

module.exports = router;