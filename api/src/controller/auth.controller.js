const mssql = require('mssql')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const { registrationSchema, loginSchema } = require('../utils/validators')
const { sqlConfig } = require('../config/database.connection.config')

module.exports.registerCustomer = async (req, res)=>{
    try {
        
        if(!req.body){
            return res.status(400).json({error: 'Request body is missing or empty.'})
        }
    
        const { firstName, lastName, email, phoneNumber, password, profilePicture } = req.body;
        const { error } = registrationSchema.validate({ firstName, lastName, email, phoneNumber, password, profilePicture })

        if(error){
            return res.status(422).json({error: error.message})
        }
    
        const pool = await mssql.connect(sqlConfig)
        const checkEmailQuery = await pool
        .request()
        .input('email', email)
        .execute('fetchCustomerByEmailProc')
    
        if(checkEmailQuery.recordset.length > 0){
            return res.status(409).json({error: 'Email provided is already registered.'})
        }
    
        const salt = await bcrypt.genSalt(10)
        const hashedPwd = await bcrypt.hash(password, salt)
    
        await pool
        .request()
        .input('first_name', firstName)
        .input('last_name', lastName)
        .input('email', email)
        .input('phone_number', phoneNumber)
        .input('profile_picture', profilePicture)
        .input('passowrd', hashedPwd)
        .execute('createNewUserProc')
        
        return res.status(201).json({message: 'Customer account created successfully'})

    } catch (error) {
        console.log(error);
        return res.status(500).json({error: `Internal server error: ${error.message}`})   
    }
}

module.exports.login = async (req, res)=>{

    try {
        
        if(!req.body){
            return res.status(400).json({error: 'Request body is missing or empty.'})
        }
    
        const {email, password} = req.body
        const { error } = loginSchema.validate({email, password})
        if(error){
            return res.status(422).json({error: error.message})
        }
    
        const pool = await mssql.connect(sqlConfig)
        const checkEmailQuery = await pool
        .request()
        .input('email', email)
        .execute('fetchCustomerByEmailProc')
    
        if(checkEmailQuery.recordset.length <= 0){
            return res.status(404).json({error: 'Email is not registered'})
        }
    
        if(checkEmailQuery.recordset[0].is_deleted == 1){
            return res.status(403).json({error: 'Account is deactivated'})
        }
    
        const valid = await bcrypt.compare(password, checkEmailQuery.recordset[0].passowrd)
        if(!valid){
            return res.status(401).json({error: 'Invalid login crdentials'})
        }
    
        const token = jwt.sign({ email: checkEmailQuery.recordset[0].email, is_admin: checkEmailQuery.recordset[0].is_admin }, process.env.SECRET_KEY, {
            expiresIn: 24 * 60 * 60
        })
    
        const { is_verified, is_deleted ,passowrd, ...user } = checkEmailQuery.recordset[0]
    
        return res.status(200).json({message: 'Login successful', token, user})
    } catch (error) {
        return res.status(500).json({error: `Internal server error: ${error.message}`})
    }

    
}