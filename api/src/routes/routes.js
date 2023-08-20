const {Router} = require('express')
const { registerCustomer, login, deactivateCustomerAccount, reactivateCustomerAccount } = require('../controller/auth.controller')

const router = Router()

// User's authentication routes
router.post('/customer/login', login)
router.post('/customer/register', registerCustomer)
router.put('/customer/deactivate-account/:id', deactivateCustomerAccount)
router.put('/customer/reactivate-account/:id', reactivateCustomerAccount)

// Customer routes
router.get('/customer/:id')
router.get('/customers')
router.put('/customer/:id')
router.delete("/customer/:id")

module.exports = router