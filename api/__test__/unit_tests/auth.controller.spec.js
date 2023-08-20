const mssql = require('mssql')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const { registerCustomer, login } = require("../../src/controller/auth.controller")

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

})
