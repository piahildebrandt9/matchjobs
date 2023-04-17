const express = require('express');
const router = express.Router();
const controller = require('../controllers/applicantsControllers')
//findApplicants
router.post('/findApplicants',controller.findApplicants)
//addApplicants
router.post('/addApplicants',controller.addApplicants)
//deleteApplicants
router.post('/deleteApplicant',controller.deleteApplicant)
//updateApplicants
router.post('/updateApplicant',controller.updateApplicant)
//addApplication,
router.post('/addApplication',controller.addApplication)
//deleteApplication
router.post('/deleteApplications',controller.deleteApplication)
//updateJobApplication
router.post('updateJobApplication',controller.updateJobApplication)
// getAllMyJobApplications
router.post('/getAllMyJobApplications',controller.getAllMyJobApplications)
// //likeJobOffer
router.post('/likeOffer',controller.likeOffer)
// //unlikeJobOffer
router.post('/unlikeOffer',controller.unlikeOffer)

module.exports = router;