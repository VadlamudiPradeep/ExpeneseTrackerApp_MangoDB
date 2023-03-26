let express = require('express');

let router = express.Router();


let userControllers = require('../controllers/userControllers');

router.post('/signup' ,userControllers.signup);

router.post('/signIn' , userControllers.signIn);


module.exports = router ; 
