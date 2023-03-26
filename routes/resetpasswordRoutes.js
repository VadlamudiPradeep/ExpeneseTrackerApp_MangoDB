const express = require('express');

const resetpasswordController = require('../controllers/resetpasswordControllers');


const router = express.Router();

router.get('/updatepassword/:resetpasswordid', resetpasswordController.updatepassword)

router.get('/resetpassword/:id', resetpasswordController.resetpassword)

router.use('/forgotPassword', resetpasswordController.forgotpassword)

module.exports = router;
