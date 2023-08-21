const {v4} = require('uuid');
const mssql = require ('mssql');
const { sqlConfig } = require('../config/database.connection.config');


const addProduct = async (req,res)=>{
    try {
        
        const { product_name, description, price, image , category ,quantity } = req.body

        let success = false

        // have a loop to create the product the number of times as the quantity specified
        
        

        if(!product_name || !description || !price || !image || !category|| !quantity ){
            return res.json({ message: "please input fields" })
        }

        for (let item = 0; item < quantity; item++) {
            const id = v4();

            const pool = await mssql.connect(sqlConfig)

            
            if(pool.connected){
            const result =  await pool.request()
                .input('id',mssql.VarChar, id)
                .input('product_name', mssql.VarChar, product_name)
                .input('image', mssql.VarChar, image)
                .input('description', mssql.VarChar, description)
                .input('category', mssql.VarChar, category)
                .input('price', mssql.Int, price)
                .execute('addProduct')

                // console.log(result.rowsAffected);
                
                if(result.rowsAffected==1){
                    success = true
                }

        }

        }

        if(success){
            return res.json({
                message: "Product adding completed successfully"
            })
        }else if(!success){
            return res.json({message: "Product adding failled"})
        }

        

    } catch (error) {
        return res.json({Error:error.message})
    }
}

const fetchAllProducts = async (req,res)=>{
    try {
        const pool = await (mssql.connect(sqlConfig))

        const allprojects = (await pool.request().execute('fetchAllProducts')).recordset
        
        res.json({projects: allprojects})

    } catch (error) {
        return res.json({error})
    }
}

const fetchCategory = async (req,res)=>{
    try {

        const category = req.params.category

        console.log(category);

        const pool = await (mssql.connect(sqlConfig))

        const allprojects = (await pool.request().input('category', category).execute('fetchCategory')).recordset
        
        res.json({products: allprojects})
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
        return res.json({error})
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
                    res.json({
                        message: 'product updated successfully'
                    })
                }else{
                    res.json({
                        message: 'product not found'
                    })
                }

        }

    } catch (error) {
        return res.json({error})
    }
}




const deleteProject = async (req,res)=>{
    try {

        let success = []

        const { product_ids } = req.body

        const pool = await mssql.connect(sqlConfig)

        // console.log(`${product_ids} p ids`);


        for (const element of product_ids) {
            const result = await pool.request()
                .input('id', element)
                .execute('deleteProduct');
        
            // console.log(`Deletion result for ${element}:`, result);
        
            if (result.rowsAffected[0] === 1) {
                success.push(element);
            }
        }
        

        // console.log(`${success.length} success ,${product_ids.length} products`);

        if(success.length==product_ids.length){
            res.json({
                    message:  `${success.length} product(s) deleted successfully`
            })
        }else{
            res.json({
                message: `${product_ids.length-success.length} product(s) out of ${product_ids.length} failed deletion` 
            })
        }


        
        
    } catch (error) {
        return res.json({Error:error.message})
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