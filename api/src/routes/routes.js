const {Router} = require('express')
const { registerCustomer, login } = require('../controller/auth.controller')

const router = Router()

router.post('/customer/register', registerCustomer)
router.post('/customer/login', login)
router.get('/customer/:id')
router.get('/customers')
router.put('/customer/:id')
router.delete("/customer/:id")

module.exports = router