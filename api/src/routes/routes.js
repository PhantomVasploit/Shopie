const {Router} = require('express')
const { registerCustomer, login, deactivateCustomerAccount, reactivateCustomerAccount } = require('../controller/auth.controller')
const { fetchCustomerById, fetchAllCustomers, updateCustomerAccount, deleteCustomerAccount } = require('../controller/customer.controller')
const { addProduct, fetchAllProducts, fetchOneProduct, updateProduct, deleteProject, fetchCategory } = require('../controller/product.controller');
const { authorization } = require('../middleware/authorization')
const { adminAuthorization } = require('../middleware/admin.authorization')

const router = Router()

// User's authentication routes
router.post('/customer/login', login)
router.post('/customer/register', registerCustomer)
router.put('/customer/deactivate-account/:id', authorization, deactivateCustomerAccount)
router.put('/customer/reactivate-account/:id', authorization, reactivateCustomerAccount)

// Customer routes
router.get('/customer/:id', authorization, fetchCustomerById)
router.get('/customers', adminAuthorization, fetchAllCustomers)
router.put('/customer/:id', authorization, updateCustomerAccount)
router.delete("/customer/:id", adminAuthorization, deleteCustomerAccount)

//product routes
router.post('/products',  addProduct);
router.put('/:id', adminAuthorization, updateProduct);
router.delete('/', adminAuthorization, deleteProject);
router.get('/', fetchAllProducts);
router.get('/:id',fetchOneProduct);
router.get('/category/:category', fetchCategory);

module.exports = router