const {Router} = require('express');
const { addProduct, fetchAllProducts, fetchOneProduct, updateProduct, deleteProject, fetchCategory } = require('../productsController/productController');


const productRouter = Router();

productRouter.post('/',addProduct);
productRouter.get('/', fetchAllProducts);
productRouter.get('/category/:category', fetchCategory);
productRouter.get('/:id',fetchOneProduct);
productRouter.put('/:id',updateProduct);
productRouter.delete('/',deleteProject);


module.exports = {
    productRouter
}
