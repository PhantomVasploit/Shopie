const mssql = require('mssql')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const crypto = require('crypto')
const nodemailer = require('nodemailer')

const { registerCustomer, login, deactivateCustomerAccount, reactivateCustomerAccount, forgotPassword, verifyToken, resetPassword } = require("../../src/controller/auth.controller")

describe('User authentication tests', ()=>{

    describe('Customer registration', ()=>{

        it('should fail if no request body is provided', async()=>{

            const request = {}

            const response = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            }

            await registerCustomer(request, response)

            expect(response.status).toHaveBeenCalledWith(400)
            expect(response.json).toHaveBeenCalledWith({error: 'Request body is missing or empty.'})
        })

        it('should fail if email is already registered', async()=>{

            const mockRecordSet = [
                {
                    firstName: 'Tanjiro',
                    lastName: 'Kamado',
                    email: 'tanjiro@gmail.com',
                    phoneNumber: '0712345678',
                    profilePicture: 'https://www.phantomlabs.com',
                    password: 'hjghgdgfdhg'
                }
            ]

            const request = {
                body: {
                    firstName: 'Tanjiro',
                    lastName: 'Kamado',
                    email: 'tanjiro@gmail.com',
                    phoneNumber: '0712345678',
                    profilePicture: 'https://www.phantomlabs.com',
                    password: 'hjghgdgfdhg'
                }
            }

            const response = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            }

            jest.spyOn(mssql, 'connect').mockResolvedValueOnce({
                request: jest.fn().mockReturnThis(),
                input: jest.fn().mockReturnThis(),
                execute: jest.fn().mockResolvedValueOnce({ recordset: mockRecordSet })
            })

            await registerCustomer(request, response)
            
            expect(response.status).toHaveBeenCalledWith(409)
        })

        it('should create a customer account if request body is valid', async()=>{
    
            const mockRecordSet = []
    
            const request = {
                body: {
                    firstName: 'Tanjiro',
                    lastName: 'Kamado',
                    email: 'tanjiro@gmail.com',
                    phoneNumber: '0712345678',
                    profilePicture: 'https://www.phantomlabs.com',
                    password: 'hjghgdgfdhg'
                }
            }
    
            const response = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            }
    
            jest.spyOn(mssql, 'connect').mockResolvedValueOnce({
                request: jest.fn().mockReturnThis(),
                input: jest.fn().mockReturnThis(),
                execute: jest.fn().mockResolvedValueOnce({ recordset: mockRecordSet })
            })
    
    
            jest.spyOn(bcrypt, 'genSalt').mockResolvedValueOnce()
            jest.spyOn(bcrypt, 'hash').mockResolvedValueOnce()
    
    
            await registerCustomer(request, response)
            
            expect(response.status).toHaveBeenCalledWith(201)
            expect(response.json).toHaveBeenCalledWith({message: 'Customer account created successfully'})
        })
    })

    describe('User login', ()=>{
        it('should fail if request body is absent or empty', async()=>{
            const request = {}
            const response = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            }

            await login(request, response)
            expect(response.status).toHaveBeenCalledWith(400)
            expect(response.json).toHaveBeenCalledWith({error: 'Request body is missing or empty.'})
        })

        it('should fail if the email is not registered', async()=>{
            const mockRecordSet = []

            const request = {
                body: {
                    email: 'tanjiro@gmail.com',
                    password: 'hjghgdgfdhg'
                }
            }

            const response = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            }

            jest.spyOn(mssql, 'connect').mockResolvedValueOnce({
                request: jest.fn().mockReturnThis(),
                input: jest.fn().mockReturnThis(),
                execute: jest.fn().mockResolvedValueOnce({ recordset: mockRecordSet })
            })

            await login(request, response)

            expect(response.status).toHaveBeenCalledWith(404)
            expect(response.json).toHaveBeenCalledWith({error: 'Email is not registered'})
        })


        it('should fail if the account is deactivated', async()=>{
            const mockRecordSet = [
                {
                    firstName: 'Tanjiro',
                    lastName: 'Kamado',
                    email: 'tanjiro@gmail.com',
                    phoneNumber: '0712345678',
                    profilePicture: 'https://www.phantomlabs.com',
                    password: 'hjghgdgfdhg',
                    is_verified: 1,
                    is_deleted: 1,
                    is_admin: 0
                }
            ]

            const request = {
                body: {
                    email: 'tanjiro@gmail.com',
                    password: 'hjghgdgfdhg'
                }
            }

            const response = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            }

            jest.spyOn(mssql, 'connect').mockResolvedValueOnce({
                request: jest.fn().mockReturnThis(),
                input: jest.fn().mockReturnThis(),
                execute: jest.fn().mockResolvedValueOnce({ recordset: mockRecordSet })
            })

            await login(request, response)

            expect(response.status).toHaveBeenCalledWith(403)
            expect(response.json).toHaveBeenCalledWith({error: 'Account is deactivated'})
        })

        it('should fail if the password is invalid', async()=>{
            const mockRecordSet = [
                {
                    firstName: 'Tanjiro',
                    lastName: 'Kamado',
                    email: 'tanjiro@gmail.com',
                    phoneNumber: '0712345678',
                    profilePicture: 'https://www.phantomlabs.com',
                    password: 'hjghgdgfdhg',
                    is_verified: 1,
                    is_deleted: 0,
                    is_admin: 0
                }
            ]

            const request = {
                body: {
                    email: 'tanjiro@gmail.com',
                    password: 'hjghgdgfdhg'
                }
            }

            const response = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            }

            jest.spyOn(mssql, 'connect').mockResolvedValueOnce({
                request: jest.fn().mockReturnThis(),
                input: jest.fn().mockReturnThis(),
                execute: jest.fn().mockResolvedValueOnce({ recordset: mockRecordSet })
            })

            jest.spyOn(bcrypt, 'compare').mockResolvedValueOnce(false)

            await login(request, response)

            expect(response.status).toHaveBeenCalledWith(401)
            expect(response.json).toHaveBeenCalledWith({error: 'Invalid login crdentials'})
        })

        it('should login in user if email and password are valid and the account is active', async()=>{
            const mockRecordSet = [
                {
                    firstName: 'Tanjiro',
                    lastName: 'Kamado',
                    email: 'tanjiro@gmail.com',
                    phoneNumber: '0712345678',
                    profilePicture: 'https://www.phantomlabs.com',
                    password: 'hjghgdgfdhg',
                    is_verified: 1,
                    is_deleted: 0,
                    is_admin: 0
                }
            ]

            const request = {
                body: {
                    email: 'tanjiro@gmail.com',
                    password: 'hjghgdgfdhg'
                }
            }

            const response = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            }

            jest.spyOn(mssql, 'connect').mockResolvedValueOnce({
                request: jest.fn().mockReturnThis(),
                input: jest.fn().mockReturnThis(),
                execute: jest.fn().mockResolvedValueOnce({ recordset: mockRecordSet })
            })

            jest.spyOn(bcrypt, 'compare').mockResolvedValueOnce(true)

            jest.spyOn(jwt, 'sign').mockReturnValueOnce('sampleToken12345')

            await login(request, response)

            expect(response.status).toHaveBeenCalledWith(200)
            expect(response.json).toHaveBeenCalledWith({
                message: 'Login successful',
                token: 'sampleToken12345',
                user: {
                    firstName: 'Tanjiro',
                    lastName: 'Kamado',
                    email: 'tanjiro@gmail.com',
                    phoneNumber: '0712345678',
                    profilePicture: 'https://www.phantomlabs.com',
                    password: 'hjghgdgfdhg',
                    is_admin: 0
                }
            })
        })

    })

    describe('Customer account deactivation and activation', ()=>{
        
        it('should fail to deactivate customer account if id passed is invalid', async()=>{
            const mockRecordSet = []

            const request = {
                params: {
                    id: 0
                }
            }

            const response = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            }

            jest.spyOn(mssql, 'connect').mockResolvedValueOnce({
                request: jest.fn().mockReturnThis(),
                input: jest.fn().mockReturnThis(),
                execute: jest.fn().mockResolvedValueOnce({ recordset: mockRecordSet })
            })

            await deactivateCustomerAccount(request, response)
            expect(response.status).toHaveBeenCalledWith(404)
            expect(response.json).toHaveBeenCalledWith({error: "Customer account not found"})

        })

        it('should fail to deactivate customer account if account is already deactivated', async()=>{
            const mockRecordSet = [
                {
                    firstName: 'Tanjiro',
                    lastName: 'Kamado',
                    email: 'tanjiro@gmail.com',
                    phoneNumber: '0712345678',
                    profilePicture: 'https://www.phantomlabs.com',
                    password: 'hjghgdgfdhg',
                    is_verified: 1,
                    is_deleted: 1,
                    is_admin: 0
                }
            ]

            const request = {
                params: {
                    id: 1
                }
            }

            const response = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            }

            jest.spyOn(mssql, 'connect').mockResolvedValueOnce({
                request: jest.fn().mockReturnThis(),
                input: jest.fn().mockReturnThis(),
                execute: jest.fn().mockResolvedValueOnce({ recordset: mockRecordSet })
            })

            await deactivateCustomerAccount(request, response)
            expect(response.status).toHaveBeenCalledWith(400)
            expect(response.json).toHaveBeenCalledWith({error: 'Customer account is laready deactivatred'})

        })

        it('should deactivate customer account if id passed is valid', async()=>{
            const mockRecordSet = [
                {
                    firstName: 'Tanjiro',
                    lastName: 'Kamado',
                    email: 'tanjiro@gmail.com',
                    phoneNumber: '0712345678',
                    profilePicture: 'https://www.phantomlabs.com',
                    password: 'hjghgdgfdhg',
                    is_verified: 1,
                    is_deleted: 0,
                    is_admin: 0
                }
            ]

            const request = {
                params: {
                    id: 1
                }
            }

            const response = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            }

            jest.spyOn(mssql, 'connect').mockResolvedValueOnce({
                request: jest.fn().mockReturnThis(),
                input: jest.fn().mockReturnThis(),
                execute: jest.fn().mockResolvedValueOnce({ recordset: mockRecordSet })
            })

            await deactivateCustomerAccount(request, response)
            expect(response.status).toHaveBeenCalledWith(200)
            expect(response.json).toHaveBeenCalledWith({message: 'Customer account deactivated successfully'})

        })

        it('should fail to reactivate customer account if id passed is invalid', async()=>{
            const mockRecordSet = []

            const request = {
                params: {
                    id: 0
                },
                body: {
                    email: 'tanjiro@gmail.com',
                    password: 'pajoy9903'
                }
            }

            const response = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            }

            jest.spyOn(mssql, 'connect').mockResolvedValueOnce({
                request: jest.fn().mockReturnThis(),
                input: jest.fn().mockReturnThis(),
                execute: jest.fn().mockResolvedValueOnce({ recordset: mockRecordSet })
            })

            await reactivateCustomerAccount(request, response)
            expect(response.status).toHaveBeenCalledWith(404)
            expect(response.json).toHaveBeenCalledWith({error: "Customer account not found"})

        })
        
        it('should fail to reactivate customer account if account is already active', async()=>{
            const mockRecordSet = [
                {
                    firstName: 'Tanjiro',
                    lastName: 'Kamado',
                    email: 'tanjiro@gmail.com',
                    phoneNumber: '0712345678',
                    profilePicture: 'https://www.phantomlabs.com',
                    password: 'hjghgdgfdhg',
                    is_verified: 1,
                    is_deleted: 0,
                    is_admin: 0
                }
            ]

            const request = {
                params: {
                    id: 1
                },
                body: {
                    email: 'tanjiro@gmail.com',
                    password: 'pajoy9903'
                }
            }

            const response = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            }

            jest.spyOn(mssql, 'connect').mockResolvedValueOnce({
                request: jest.fn().mockReturnThis(),
                input: jest.fn().mockReturnThis(),
                execute: jest.fn().mockResolvedValueOnce({ recordset: mockRecordSet })
            })

            await reactivateCustomerAccount(request, response)
            expect(response.status).toHaveBeenCalledWith(400)
            expect(response.json).toHaveBeenCalledWith({error: 'Customer account is already active'})

        })

        it('should reactivate customer account if id provided is valid', async()=>{
            const mockRecordSet = [
                {
                    firstName: 'Tanjiro',
                    lastName: 'Kamado',
                    email: 'tanjiro@gmail.com',
                    phoneNumber: '0712345678',
                    profilePicture: 'https://www.phantomlabs.com',
                    password: 'hjghgdgfdhg',
                    is_verified: 1,
                    is_deleted: 1,
                    is_admin: 0
                }
            ]

            const request = {
                params: {
                    id: 1
                },
                body: {
                    email: 'tanjiro@gmail.com',
                    password: 'pajoy9903'
                }
            }

            const response = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            }

            jest.spyOn(mssql, 'connect').mockResolvedValueOnce({
                request: jest.fn().mockReturnThis(),
                input: jest.fn().mockReturnThis(),
                execute: jest.fn().mockResolvedValueOnce({ recordset: mockRecordSet })
            })

            jest.spyOn(bcrypt, 'compare').mockResolvedValueOnce(true)

            await reactivateCustomerAccount(request, response)
            expect(response.status).toHaveBeenCalledWith(200)
            expect(response.json).toHaveBeenCalledWith({message: 'Customer account re-activated successfuly'})

        })
    })

    describe('forgot password', ()=>{

        it('should fail with status 400 and error message if request body is missing', async()=>{

            const request = {}

            const response = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            }

            await forgotPassword(request, response)
            expect(response.status).toHaveBeenCalledWith(400)
            expect(response.json).toHaveBeenCalledWith({ error: 'Request body can not be empty' })
        })

        it('should fail if email is not registered', async()=>{

            const mockRecordSet = []

            const request = {
                body: {
                    email: 'tanjiro@gmail.com'
                }
            }

            const response = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            }

            jest.spyOn(mssql, 'connect').mockResolvedValueOnce({
                request: jest.fn().mockReturnThis(),
                input: jest.fn().mockReturnThis(),
                execute: jest.fn().mockResolvedValueOnce({ recordset: mockRecordSet })
            })

            await forgotPassword(request, response)
            expect(response.status).toHaveBeenCalledWith(404)
            expect(response.json).toHaveBeenCalledWith({error: 'Email is not registered'})
        })

        it('should send a mail if email is authentic', async()=>{
            
            const mockRecordSet = [
                {
                    firstName: 'Tanjiro',
                    lastName: 'Kamado',
                    email: 'tanjiro@gmail.com',
                    phoneNumber: '0712345678',
                    profilePicture: 'https://www.phantomlabs.com',
                    password: 'hjghgdgfdhg',
                    is_verified: 1,
                    is_deleted: 1,
                    is_admin: 0
                }
            ]

            const request = {
                body: {
                    email: 'tanjiro@gmail.com'
                }
            }

            const response = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            }

            jest.spyOn(mssql, 'connect').mockResolvedValueOnce({
                request: jest.fn().mockReturnThis(),
                input: jest.fn().mockReturnThis(),
                execute: jest.fn().mockResolvedValueOnce({ recordset: mockRecordSet })
            })

            jest.spyOn(crypto, 'randomBytes').mockReturnValueOnce('reset_token')

            const createTransportSpy = jest.spyOn(nodemailer, 'createTransport');
            const sendMailMock = jest.fn((mailOptions, callback) => {
                callback(null, 'Email sent successfully');
            });
            createTransportSpy.mockReturnValue({ sendMail: sendMailMock });

            await forgotPassword(request, response)
            expect(response.status).toHaveBeenCalledWith(200)
            expect(response.json).toHaveBeenCalledWith({message: 'Password reset email sent'})
        })

        it('should fail to send a mail if an error occurs', async()=>{
            
            const mockRecordSet = [
                {
                    firstName: 'Tanjiro',
                    lastName: 'Kamado',
                    email: 'tanjiro@gmail.com',
                    phoneNumber: '0712345678',
                    profilePicture: 'https://www.phantomlabs.com',
                    password: 'hjghgdgfdhg',
                    is_verified: 1,
                    is_deleted: 1,
                    is_admin: 0
                }
            ]

            const request = {
                body: {
                    email: 'tanjiro@gmail.com'
                }
            }

            const response = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            }

            jest.spyOn(mssql, 'connect').mockResolvedValueOnce({
                request: jest.fn().mockReturnThis(),
                input: jest.fn().mockReturnThis(),
                execute: jest.fn().mockResolvedValueOnce({ recordset: mockRecordSet })
            })

            jest.spyOn(crypto, 'randomBytes').mockReturnValueOnce('reset_token')

            const createTransportSpy = jest.spyOn(nodemailer, 'createTransport');
            const sendMailMock = jest.fn((mailOptions, callback) => {
                callback(new Error('Internal server error'), null);
            });
            createTransportSpy.mockReturnValue({ sendMail: sendMailMock });

            await forgotPassword(request, response)
            expect(response.status).toHaveBeenCalledWith(500)
            expect(response.json).toHaveBeenCalledWith({error: 'Internal server error'})
        })

    })

    describe('verify token', ()=>{
        
        it('should fail if request body is not set', async()=>{
            const request = {}

            const response = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            }

            await verifyToken(request, response)
            expect(response.status).toHaveBeenCalledWith(400)
            expect(response.json).toHaveBeenCalledWith({error: 'Request boody can not be empty'})
        })

        it('should fail if email is not registered', async()=>{

            const mockRecordSet = []

            const request = {
                body: {
                    email: 'tanjiro@gmail.com',
                    token: 'ghdjkhljkhjkh'
                }
            }

            const response = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            }

            
            jest.spyOn(mssql, 'connect').mockResolvedValueOnce({
                request: jest.fn().mockReturnThis(),
                input: jest.fn().mockReturnThis(),
                execute: jest.fn().mockResolvedValueOnce({ recordset: mockRecordSet })
            })

            await verifyToken(request, response)

            expect(response.status).toHaveBeenCalledWith(404)
            expect(response.json).toHaveBeenCalledWith({error: 'Email is not registered'})
        })

        it('should fail if token is invalid', async()=>{

            const mockRecordSet = [
                {
                    firstName: 'Tanjiro',
                    lastName: 'Kamado',
                    email: 'tanjiro@gmail.com',
                    phoneNumber: '0712345678',
                    profilePicture: 'https://www.phantomlabs.com',
                    password: 'hjghgdgfdhg',
                    is_verified: 1,
                    is_deleted: 1,
                    is_admin: 0,
                    password_reset_token: 'ghkh.kjujhgvk,hj'
                }
            ]

            const request = {
                body: {
                    email: 'tanjiro@gmail.com',
                    token: 'ghdjkhljkhjkh'
                }
            }

            const response = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            }

            
            jest.spyOn(mssql, 'connect').mockResolvedValueOnce({
                request: jest.fn().mockReturnThis(),
                input: jest.fn().mockReturnThis(),
                execute: jest.fn().mockResolvedValueOnce({ recordset: mockRecordSet })
            })

            await verifyToken(request, response)

            expect(response.status).toHaveBeenCalledWith(400)
            expect(response.json).toHaveBeenCalledWith({error: 'Invalid token or token expired'})
        })

        it('should pass if token is invalid', async()=>{

            const mockRecordSet = [
                {
                    firstName: 'Tanjiro',
                    lastName: 'Kamado',
                    email: 'tanjiro@gmail.com',
                    phoneNumber: '0712345678',
                    profilePicture: 'https://www.phantomlabs.com',
                    password: 'hjghgdgfdhg',
                    is_verified: 1,
                    is_deleted: 1,
                    is_admin: 0,
                    password_reset_token: 'ghdjkhljkhjkh'
                }
            ]

            const request = {
                body: {
                    email: 'tanjiro@gmail.com',
                    token: 'ghdjkhljkhjkh'
                }
            }

            const response = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            }

            
            jest.spyOn(mssql, 'connect').mockResolvedValueOnce({
                request: jest.fn().mockReturnThis(),
                input: jest.fn().mockReturnThis(),
                execute: jest.fn().mockResolvedValueOnce({ recordset: mockRecordSet })
            })

            await verifyToken(request, response)

            expect(response.status).toHaveBeenCalledWith(200)
            expect(response.json).toHaveBeenCalledWith({message: `Valid Token`})
        })

    })

    describe('Reset password', ()=>{

        it('should fail if request body is missing or empty', async()=>{
            
            const request = {}
            const response = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            }

        
            await resetPassword(request, response)
            expect(response.status).toHaveBeenCalledWith(400)
            expect(response.json).toHaveBeenCalledWith({error: "Request body can not be empty"})
        })

        it('should fail if email is not registered', async()=>{
            const mockRecordSet = []

            const request = {
                body: {
                    email: 'tanjiro@gmail.com',
                    password: 'ghdjkhljkhjkh'
                }
            }

            const response = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            }

            
            jest.spyOn(mssql, 'connect').mockResolvedValueOnce({
                request: jest.fn().mockReturnThis(),
                input: jest.fn().mockReturnThis(),
                execute: jest.fn().mockResolvedValueOnce({ recordset: mockRecordSet })
            })
            
            await resetPassword(request, response)
            expect(response.status).toHaveBeenCalledWith(404)
        })
        
        it('should reset password if email is valid', async()=>{
            const mockRecordSet = [
                {
                    firstName: 'Tanjiro',
                    lastName: 'Kamado',
                    email: 'tanjiro@gmail.com',
                    phoneNumber: '0712345678',
                    profilePicture: 'https://www.phantomlabs.com',
                    password: 'hjghgdgfdhg',
                    is_verified: 1,
                    is_deleted: 1,
                    is_admin: 0,
                    password_reset_token: 'ghdjkhljkhjkh'
                }
            ]

            const request = {
                body: {
                    email: 'tanjiro@gmail.com',
                    password: 'ghdjkhljkhjkh'
                }
            }

            const response = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            }

            
            jest.spyOn(mssql, 'connect').mockResolvedValueOnce({
                request: jest.fn().mockReturnThis(),
                input: jest.fn().mockReturnThis(),
                execute: jest.fn().mockResolvedValueOnce({ recordset: mockRecordSet })
            })


            jest.spyOn(bcrypt, 'genSalt').mockResolvedValueOnce()
            jest.spyOn(bcrypt, 'hash').mockResolvedValueOnce()
            
            await resetPassword(request, response)
            expect(response.status).toHaveBeenCalledWith(200)
            expect(response.json).toHaveBeenCalledWith({message: 'Password reset successful'})
        })

    })

})
