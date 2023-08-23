const mssql = require('mssql')
const bcrypt = require('bcrypt')
const crypto = require('crypto')
const jwt = require('jsonwebtoken')
const nodemailer = require('nodemailer')

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

module.exports.deactivateCustomerAccount = async(req, res)=>{
    try {
        const {id} = req.params
        const pool = await mssql.connect(sqlConfig)
        const checkEmailQuery = await pool
        .request()
        .input('id', id)
        .execute('fetchCustomerById')

        if(checkEmailQuery.recordset.length <= 0){
            return res.status(404).json({error: "Customer account not found"})
        }

        if(checkEmailQuery.recordset[0].is_deleted ==1){
            return res.status(400).json({error: 'Customer account is laready deactivatred'})
        }

        await pool
        .request()
        .input('id', id)
        .execute('deactivateCustomerAccount')

        return res.status(200).json({message: 'Customer account deactivated successfully'})

    } catch (error) {
        return res.status(500).json({error: `Internal server error: ${error.message}`})
    }
}

module.exports.reactivateCustomerAccount = async(req, res)=>{

    try {
        
        const {email, password} = req.body

        const pool = await mssql.connect(sqlConfig)
        const checkCustomerQuery = await pool
        .request()
        .input('email', email)
        .execute('fetchCustomerByEmailProc')

        if(checkCustomerQuery.recordset.length <= 0){
            return res.status(404).json({error: 'Customer account not found'})
        }

        if(checkCustomerQuery.recordset[0].is_deleted ==0){
            return res.status(400).json({error: 'Customer account is already active'})
        }
        
        const valid = await bcrypt.compare(password, checkCustomerQuery.recordset[0].passowrd)

        if(!valid){
            res.status(401).json({error: 'Invalid password'})
        }


        await pool
        .request()
        .input('email', email)
        .execute('reactivateCustomerAccount')

        return res.status(200).json({message: 'Customer account re-activated successfuly'})

    } catch (error) {
        return res.status(500).json({error: `Internal server error: ${error.message}`})
    }

}


module.exports.forgotPassword = async(req, res)=>{
    try {
        
        const { email } = req.body
        const token = crypto.randomBytes(20).toString('hex')

        const pool = await mssql.connect(sqlConfig)
        const checkEmailQuery = await pool
        .request()
        .input('email', email)
        .execute('fetchCustomerByEmailProc')

        if(checkEmailQuery.recordset.length <= 0){
            return res.status(404).json({error: 'Email is not registered'})
        }
        
        await pool
        .request()
        .input('email', email)
        .input('password_reset_token', token)
        .execute('resetPasswordProc')

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            port: 587,
            auth: {
                user: process.env.EMAIL,
                pass: process.env.EMAIL_PWD
            }
        })

        const mailOptions = {
            from: process.env.EMAIL,
            to: checkEmailQuery.recordset[0].email,
            subject: 'Shopie Password Reset',
            text: `Please use the token we've sent you to change your password. Token: ${token}`
        }

        transporter.sendMail(mailOptions, (error, info)=>{
            if(error){
                res.status(500).json({error: 'Internal server error'})
            }
            res.status(200).json({message: 'Password reset email sent'})
        })

    } catch (error) {
        return res.status(500).json({error: `Internal server error: ${error.message}`})
    }
}


module.exports.verifyToken = async(req, res)=>{
    try {
        const {token, email} = req.body
        const pool = await mssql.connect(sqlConfig)
        const checkEmailQuery = await pool
        .request()
        .input('email', email)
        .execute('fetchCustomerByEmailProc')

        if(checkEmailQuery.recordset.length <= 0){
            return res.status(404).json({error: 'Email is not registered'})
        }
        
        if(checkEmailQuery.recordset[0].password_reset_token == token ){
            return res.status(200).json({message: `Valid Token`})
        }
        return res.status(400).json({error: 'Invalid token or token expired'})
    } catch (error) {
        return res.status(500).json({error: `Internal server error: ${error.message}`})
    }
}

module.exports.resetPassword = async(req, res)=>{
    try {
        
        const { password, email } = req.body
        const pool = await mssql.connect(sqlConfig)
        const checkEmailQuery = await pool
        .request()
        .input('email', email)
        .execute('fetchCustomerByEmailProc')

        if(checkEmailQuery.recordset.length <= 0){
            return res.status(404).json({error: 'Email is not registered'})
        }

        const salt = await bcrypt.genSalt(10)
        const hashedPwd = await bcrypt.hash(password, salt)

        await pool
        .request()
        .input('passowrd', hashedPwd)
        .input('email', email)
        .execute('resetPasswordProc')

        return res.status(200).json({message: 'Password reset successful'})
    } catch (error) {
        return res.status(500).json({error: `Internal server error: ${error.message}`})
    }
}