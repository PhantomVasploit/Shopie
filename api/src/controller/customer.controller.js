const mssql = require('mssql')

const { sqlConfig } = require('../config/database.connection.config')
const { updateSchema } = require('../utils/validators')


module.exports.fetchAllCustomers = async(req, res)=>{
    try {
        const pool = await mssql.connect(sqlConfig)
        const result = await pool
        .request()
        .execute('fetchAllCustomersProc')
        return res.status(200).json({message: 'Fetch successful', customers: result.recordset})
    } catch (error) {
        return res.status(500).json({error: 'Internal server error'})
    }
}

module.exports.fetchCustomerById = async(req, res)=>{
    try {
        const {id} = req.params
        const pool = await mssql.connect(sqlConfig)
        const result = await pool
        .request()
        .input('id', id)
        .execute("fetchCustomerById")

        if(result.recordset.length <= 0){
            return res.status(404).json({error: 'Customer account not found'})
        }

        return res.status(200).json({message: 'Fetch successful', customer: result.recordset})
    } catch (error) {
        return res.status(500).json({error: 'Internal server error'})
    }
}

module.exports.updateCustomerAccount = async(req, res)=>{
    try {
        const {id} = req.params

        if(!req.body){
            return res.status(400).json({error: 'Request body is empty or missing'})
        }
        const { firstName, lastName, email, phoneNumber, profilePicture } = req.body;

        const {error} = updateSchema.validate({ firstName, lastName, email, phoneNumber, profilePicture })
        if(error){
            return res.status(422).json({error: error.message})
        }

        const pool = await mssql.connect(sqlConfig)
        const result = await pool
        .request()
        .input('id', id)
        .execute('fetchCustomerById')

        if(result.recordset.length <= 0){
            return res.status(404).json({error: 'Customer account not found'})
        }

        await pool
        .request()
        .input('id', id)
        .input('first_name', firstName)
        .input('last_name', lastName)
        .input('email', email)
        .input('phone_number', phoneNumber)
        .input('profile_picture', profilePicture)
        .execute('updateUserProc')

        return res.status(200).json({message: 'Account updated successful'})
    } catch (error) {
        return res.status(500).json({error: 'Internal server error'})
        
    }
}

module.exports.deleteCustomerAccount = async(req, res)=>{
    try {
        const {id} = req.params
        const pool = await mssql.connect(sqlConfig)
        const result = await pool
        .request()
        .input('id', id)
        .execute('fetchCustomerById')

        if(result.recordset.length <= 0){
            return res.status(404).json({error: 'Customer account not found'})
        }

        if(result.recordset[0].is_deleted == 1){
            return res.status(409).json({error: 'Customer account is already deactivated'})
        }

        await pool
        .request()
        .input('id', id)
        .execute('deleteCustomerProc')

        return res.status(200).json({message: 'Customer account deleted successfully'})
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({error: 'Internal server error'})
    }
}