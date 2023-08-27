const {Router} = require('express')
const { registerCustomer, login, deactivateCustomerAccount, reactivateCustomerAccount, forgotPassword, verifyToken, resetPassword } = require('../controller/auth.controller')
const { fetchCustomerById, fetchAllCustomers, updateCustomerAccount, deleteCustomerAccount } = require('../controller/customer.controller')
const { addProduct, fetchAllProducts, fetchOneProduct, updateProduct, deleteProject, fetchCategory } = require('../controller/product.controller');
const { authorization } = require('../middleware/authorization')
const { adminAuthorization } = require('../middleware/admin.authorization');
const { createNewOrder } = require('../controller/order.controller');

const router = Router()

// User's authentication routes
router.post('/customer/login', login)
router.post('/customer/verify-token', verifyToken)
router.post('/customer/register', registerCustomer)
router.post('/customer/reset-password', resetPassword)
router.post('/customer/forgot-password', forgotPassword)
router.put('/customer/reactivate-account', reactivateCustomerAccount)
router.put('/customer/deactivate-account/:id', authorization, deactivateCustomerAccount)

// Customer routes
router.get('/customer/:id', authorization, fetchCustomerById)
router.get('/customers',  fetchAllCustomers)
router.put('/customer/:id', authorization, updateCustomerAccount)
router.delete("/customer/:id", adminAuthorization, deleteCustomerAccount)

//product routes
router.post('/products', addProduct);
router.put('/products/:id', adminAuthorization, updateProduct);
router.delete('/products/:id', adminAuthorization, deleteProject);
router.get('/products', fetchAllProducts);
router.get('/:id',fetchOneProduct);
router.get('/category/:category', fetchCategory);

router.post('/order/:customerId/:productId', authorization, createNewOrder)

module.exports = router