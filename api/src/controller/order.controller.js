const mssql = require('mssql')
const { sqlConfig } = require('../config/database.connection.config')

module.exports.createNewOrder = async(req, res)=>{

    try {
        
        if(!req.body){
            return res.status(400).json({error: 'Request body can not be empty'})
        }

        const { customerId, productId } = req.params
        const { quantity } = req.body

        const pool = await mssql.connect(sqlConfig)
        const result = await pool
        .request()
        .input('customer_id', customerId)
        .input('product_id', productId)
        .input('quantity', quantity)
        .execute('createNewOrderProc')

        if(result.rowsAffected[0] >= 1){
            return res.status(201).json({message: 'Customer order created'})
        }
        return res.status(400).json({error: 'Error creating customer order'})

    } catch (error) {
        return res.status(500).json({error: 'Internal server error'})
    }

}