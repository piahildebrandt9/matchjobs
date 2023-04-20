const express = require('express');
const router = express.Router();
const controller = require('../controllers/applicantsControllers')

router.post('/register', controller.register);
router.post('/login', controller.login);
router.post('/verify_token', controller.verify_token);
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
<<<<<<< HEAD
=======
// get one job application
router.get('/getJobApplication/:id', controller.getJobApplication)
>>>>>>> e08e79f85017738f45bd21bdcc91b45d59bd3707
// getAllMyJobApplications/?id=''
router.get('/getAllMyJobApplications',controller.getAllMyJobApplications)
// //likeJobOffer
router.post('/likeOffer',controller.likeOffer)
// //unlikeJobOffer
router.post('/unlikeOffer',controller.unlikeOffer)

module.exports = router;