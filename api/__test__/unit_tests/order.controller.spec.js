const mssql = require('mssql')
const { createNewOrder } = require('../../src/controller/order.controller')


describe('Create new order', ()=>{

    it('should fail if request body is empty', async()=>{
        const request = {}
        const response = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        }

        await createNewOrder(request, response)
        expect(response.status).toHaveBeenCalledWith(400)
        expect(response.json).toHaveBeenCalledWith({ error: 'Request body can not be empty' })
    })

    it('should return error message and status code of 400 if creation of order fails', async()=>{
        
        const request = {

            params: {
                customerId: 1,
                productId: 'kjghffhkjlk'
            },
            body: {
                quantity: 500
            }
        }
        
        const response = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        }

        jest.spyOn(mssql, 'connect').mockResolvedValueOnce({
            request: jest.fn().mockReturnThis(),
            input: jest.fn().mockReturnThis(),
            execute: jest.fn().mockResolvedValueOnce({ rowsAffected: [0] })
        })

        await createNewOrder(request, response)
        expect(response.status).toHaveBeenCalledWith(400)
        expect(response.json).toHaveBeenCalledWith({ error: 'Error creating customer order' })
    })

    it('should create new order if quantity is provided in the request body and customer id and product id is provided in the request parameters', async()=>{
        
        const request = {

            params: {
                customerId: 1,
                productId: 'kjghffhkjlk'
            },
            body: {
                quantity: 500
            }
        }
        
        const response = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        }

        jest.spyOn(mssql, 'connect').mockResolvedValueOnce({
            request: jest.fn().mockReturnThis(),
            input: jest.fn().mockReturnThis(),
            execute: jest.fn().mockResolvedValueOnce({ rowsAffected: [1] })
        })

        await createNewOrder(request, response)
        expect(response.status).toHaveBeenCalledWith(201)
        expect(response.json).toHaveBeenCalledWith({ message: 'Customer order created' })
    })

})