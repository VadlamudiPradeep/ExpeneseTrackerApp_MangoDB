let express = require('express');

let premiumFeaturesControllers = require('../controllers/premiumFeaturesControllers');

let middleware = require('../middleware/auth');

let router = express();

router.get('/showLeaderBoard', middleware.authenticate , premiumFeaturesControllers.GetUserLeaderBoard);


module.exports = router;
