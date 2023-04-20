const express = require('express');
const router = express.Router();
const controller = require('../controllers/recruitersControllers')
router.post('/register', controller.register);
router.post('/login', controller.login);
router.post('/verify_token', controller.verify_token);
//findRecruiter
router.post('/findRecruiter',controller.findRecruiter)
//addRecruiter
router.post('/addRecruiter',controller.addRecruiter)
//deleteRecruiter
router.post('/deleteRecruiter',controller.deleteRecruiter)
//updateRecruiter
router.post('/updateRecruiter',controller.updateRecruiter)
//addJobOffer,
router.post('/addJobOffer',controller.addJobOffer)
//deleteJobOffer
router.post('/deleteJobOffer',controller.deleteJobOffer)
//updateJobOffer
router.post('updateJobOffer',controller.updateJobOffer)
<<<<<<< HEAD
=======
// getJobOffer
router.get('/getJobOffer/:id', controller.getJobOffer)
>>>>>>> e08e79f85017738f45bd21bdcc91b45d59bd3707
// getAllMyJobOffer/?id=''
router.get('/getAllMyJobOffers',controller.getAllMyJobOffer)
// //likeApplicant
router.post('/likeApplicant',controller.likeApplicant)
// //unlikeApplicant
router.post('/unlikeApplicant',controller.unlikeApplicant)



module.exports = router;