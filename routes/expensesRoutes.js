let express = require('express');
let router = express.Router();

let expensesControllers = require('../controllers/expensesControllers');

let middleware = require('../middleware/auth');

router.post('/addExpenses',middleware.authenticate, expensesControllers.AddExpenses);

router.get('/getExpenses' ,middleware.authenticate, expensesControllers.GetExpense);

router.delete('/deleteExpense/:id',middleware.authenticate,  expensesControllers.DeleteExpense)

 router.get('/download', middleware.authenticate,expensesControllers.downloadExpenses);

// router.get('/pages/:pages', expensesControllers.updatePages)

 router.get('/Pagination/:pageNO', middleware.authenticate,expensesControllers.pagination)

module.exports = router;