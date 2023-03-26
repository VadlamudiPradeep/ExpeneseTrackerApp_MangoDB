let express = require('express');

let purchaseControllers = require('../controllers/purchaseControllers');

let middleware = require('../middleware/auth');

let router = express();

router.get('/premiumMembership', middleware.authenticate , purchaseControllers.purchasePremium);

router.post('/updatetransactionstatus' , middleware.authenticate , purchaseControllers.updateTransactionStatus );

module.exports = router