const {v4} = require('uuid');
const mssql = require ('mssql');
const { sqlConfig } = require('../config/database.connection.config');


const addProduct = async (req,res)=>{
    try {
        
        const { product_name, description, price, image , category ,quantity } = req.body

        if(!product_name || !description || !price || !image || !category|| !quantity ){
            return res.status(400).json({ message: "please input fields" })
        }

        const id = v4();

        const pool = await mssql.connect(sqlConfig)

        const result =  await pool
        .request()
        .input('id',mssql.VarChar, id)
        .input('product_name', mssql.VarChar, product_name)
        .input('image', mssql.VarChar, image)
        .input('description', mssql.VarChar, description)
        .input('category', mssql.VarChar, category)
        .input('price', mssql.Int, price)
        .input('quantity', quantity)
        .execute('addProduct')


        if(result.rowsAffected[0] >= 1){
            return res.status(201).json({ message: "Product adding completed successfully" })
        }
        
        return res.status(400).json({error: 'Error creating product'})

    } catch (error) {
        return res.status(500).json({error: error.message})
    }
}

const fetchAllProducts = async (req,res)=>{
    try {
        const pool = await (mssql.connect(sqlConfig))

        const products = (await pool.request().execute('fetchAllProducts')).recordset
        
        res.status(200).json({products, message: 'Fetch successful'})

    } catch (error) {
        return res.json({error: error.message})
    }
}

const fetchCategory = async (req,res)=>{
    try {

        const category = req.params.category

        const pool = await (mssql.connect(sqlConfig))

        const allProducts = (await pool.request().input('category', category).execute('fetchCategory')).recordset
        
        res.status(200).json({products: allProducts, message: 'Fetch successful'})

    } catch (error) {
        return res.json({error})
    }
}


const fetchOneProduct = async (req,res)=>{
    try {

        const { id } = req.params;

        const pool = await mssql.connect(sqlConfig);
        
        const product = (await pool.request().input('id', id).execute('fetchOneProduct')).recordset[0];

        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }

        return res.json({
            product: product
        })
    } catch (error) {
        return res.json({error: error.message})
    }
}

const updateProduct= async (req,res)=>{
    try {
        const {id} = req.params

       

        const { product_name, description, price, image , category } = req.body

        if(!product_name || !description || !price || !image || !category ){
            return res.json({ message: "please input fields" })
        }

        const pool = await mssql.connect(sqlConfig)

        if(pool.connected){
            const result =  await pool.request()
                .input('id',mssql.VarChar, id)
                .input('product_name', mssql.VarChar, product_name)
                .input('image', mssql.VarChar, image)
                .input('description', mssql.VarChar, description)
                .input('category', mssql.VarChar, category)
                .input('price', mssql.Int, price)
                .execute('updateProject')

                console.log(result);
                console.log('update inside');

                if(result.rowsAffected == 1){
                    res.status(200).json({
                        message: 'product updated successfully'
                    })
                }else{
                    res.status(404).json({
                        error: 'product not found'
                    })
                }

        }

    } catch (error) {
        return res.status(500).json({error})
    }
}




const deleteProject = async (req,res)=>{
    try {


        const { id } = req.params

        const pool = await mssql.connect(sqlConfig)

        const result = await pool.request()
            .input('id', id)
            .execute('deleteProduct');
    
    
        if (result.rowsAffected[0] === 1) {
            return res.status(200).json({message: 'Product deleted successfully'})
        }
        
        return res.status(400).json({error: 'Error deleting product'})
    } catch (error) {
        return res.json({error: error.message})
    }
}


module.exports = {
    addProduct,
    fetchAllProducts,
    fetchOneProduct,
    updateProduct,
    deleteProject,
    fetchCategory
}