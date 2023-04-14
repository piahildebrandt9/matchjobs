const express = require('express');
const router = express.Router();
const controller = require('../controllers/adminControllers')


// findAdmins - log in
router.post('/findAdmin', controller.findAdmin);
// Add an admin (not displayed on frontend)
router.post('/addAdmin', controller.addAdmin);
// getAll (get all datas from recruiters)
router.get('/getAllRecruiters', controller.getAllRecruiters);
// // getAll (get all datas from applicants)
// router.get('/getAllApplicants', controller.getAllApplicants);
// // deleteApplicants
// router.post('/deleteApplicant', controller.deleteApplicant);
// //deleteRecruiters
// router.post('/deleteRecruiter', controller.deleteRecruiter);
// //deleteJobOffers
// router.post('/deleteOffers', controller.deleteOffers);
// //deleteJobApplications
// router.post('/deleteApplications', controller.deleteApplications);

module.exports = router;