const mssql = require('mssql')
const { fetchAllCustomers, fetchCustomerById, updateCustomerAccount, deleteCustomerAccount } = require('../../src/controller/customer.controller')

describe('Customer api endpoints', ()=>{

    it('should return a list of all customers', async()=>{
        
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

        const request = {}

        const response = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        }

        jest.spyOn(mssql, 'connect').mockResolvedValueOnce({
            request: jest.fn().mockReturnThis(),
            input: jest.fn().mockReturnThis(),
            execute: jest.fn().mockResolvedValueOnce({recordset: mockRecordSet})
        })

        await fetchAllCustomers(request, response)

        expect(response.status).toHaveBeenCalledWith(200)
        expect(response.json).toHaveBeenCalledWith({
            message: 'Fetch successful',
            customers: mockRecordSet
        })
    })
    
    it('should fail to fetch user by id if the id is invalid', async()=>{

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
            execute: jest.fn().mockResolvedValueOnce({recordset: mockRecordSet})
        })

        await fetchCustomerById(request, response)
        expect(response.status).toHaveBeenCalledWith(404)
        expect(response.json).toHaveBeenCalledWith({error: 'Customer account not found'})
    })

    it('should return deatils on a customer when the id provided is valid', async()=>{

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
            execute: jest.fn().mockResolvedValueOnce({recordset: mockRecordSet})
        })

        await fetchCustomerById(request, response)
        expect(response.status).toHaveBeenCalledWith(200)
        expect(response.json).toHaveBeenCalledWith({
            message: 'Fetch successful',
            customer: mockRecordSet
        })
    })

    it('should fail to update user account if request body is not provided', async()=>{
        
        const request = {
            params: {
                id: 1
            }
        }

        const response = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        }

        await updateCustomerAccount(request, response)
        expect(response.status).toHaveBeenCalledWith(400)
        expect(response.json).toHaveBeenCalledWith({error: 'Request body is empty or missing'})
    })

    it('should fail to update user account if the id provided is invalid', async()=>{
        const mockRecordSet = []

        const request = {
            params: {
                id: 0
            },
            body: {
                firstName: 'Yuji',
                lastName: 'Itadori',
                email: 'yujio@gmail.com',
                phoneNumber: '0712345678',
                profilePicture: 'https://www.phantomlabs.com'
            }
        }

        const response = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        }

        jest.spyOn(mssql, 'connect').mockResolvedValueOnce({
            request: jest.fn().mockReturnThis(),
            input: jest.fn().mockReturnThis(),
            execute: jest.fn().mockResolvedValueOnce({recordset: mockRecordSet})
        })

        await updateCustomerAccount(request, response)
        expect(response.status).toHaveBeenCalledWith(404)
        expect(response.json).toHaveBeenCalledWith({error: 'Customer account not found'})
    })

    it('should update user account if the id provided is valid', async()=>{
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
                firstName: 'Yuji',
                lastName: 'Itadori',
                email: 'yujio@gmail.com',
                phoneNumber: '0712345678',
                profilePicture: 'https://www.phantomlabs.com'
            }
        }

        const response = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        }

        jest.spyOn(mssql, 'connect').mockResolvedValueOnce({
            request: jest.fn().mockReturnThis(),
            input: jest.fn().mockReturnThis(),
            execute: jest.fn().mockResolvedValueOnce({recordset: mockRecordSet})
        })

        await updateCustomerAccount(request, response)
        expect(response.status).toHaveBeenCalledWith(200)
        expect(response.json).toHaveBeenCalledWith({message: 'Account updated successful'})
    })

    it('should fail to delete user account if id provided is invalid', async()=>{
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
            execute: jest.fn().mockResolvedValueOnce({recordset: mockRecordSet})
        })

        await deleteCustomerAccount(request, response)
        expect(response.status).toHaveBeenCalledWith(404)
        expect(response.json).toHaveBeenCalledWith({error: 'Customer account not found'})
    })

    it('should fail to  delete user account if account is already deleted', async()=>{
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
            execute: jest.fn().mockResolvedValueOnce({recordset: mockRecordSet})
        })

        await deleteCustomerAccount(request, response)

        expect(response.status).toHaveBeenCalledWith(409)
        expect(response.json).toHaveBeenCalledWith({error: 'Customer account is already deactivated'})
    })

    it('should delete user account if id provided is valid', async()=>{
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
            execute: jest.fn().mockResolvedValueOnce({recordset: mockRecordSet})
        })

        await deleteCustomerAccount(request, response)

        expect(response.status).toHaveBeenCalledWith(200)
        expect(response.json).toHaveBeenCalledWith({message: 'Customer account deleted successfully'})
    })
})