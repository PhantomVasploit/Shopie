const jwt = require('jsonwebtoken')

const {adminAuthorization} = require('../../src/middleware/admin.authorization')


describe("Admin authorization middleware", ()=>{
    
    let verifySpy

    beforeEach(()=>{
        verifySpy = jest.spyOn(jwt, 'verify')
    })

    afterEach(()=>{
        verifySpy.mockRestore()
    })

    it('should faild if no authorization headers is set', async()=>{
        const req = {
            headers: {

                authorization: ""
            }
        }

        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        }

        const next = jest.fn()

        await adminAuthorization(req, res, next)

        expect(res.status).toHaveBeenCalledWith(401)
        expect(res.json).toHaveBeenCalledWith({error: 'Authentication headers not set'})
    })


    it('should failed if no token is provided', async()=>{
        
        const req = {
            headers: {
                authorization: "Bearer "
            }
        }

        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        }

        const next = jest.fn()

        await adminAuthorization(req, res, next)
        expect(res.status).toHaveBeenCalledWith(401)
        expect(res.json).toHaveBeenCalledWith({error: 'Authentication token not set'})

    })


    it('should retrun a 401 if jwt.verify returns an error', async()=>{
        
        verifySpy.mockImplementation((token, secret, callback)=>{
            callback(new Error('Invalid token'), null)
        })

        const req = {
            headers: {
                authorization: "Bearer kjghlijhgjhlkjkjlgbhkghjhjkhh"
            }
        }

        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        }

        const next = jest.fn()

        await adminAuthorization(req, res, next)
        expect(res.status).toHaveBeenCalledWith(401)
        expect(res.json).toHaveBeenCalledWith({error: 'Invalid token'})
    })

    it('should return a 401 error if decodedToken is not an admin', async()=>{
        
        const decodedToken = {is_admin: 0}

        verifySpy.mockImplementation((token, secret, callback)=>{
            callback(null, decodedToken)
        })
        
        const req = {
            headers: {
                authorization: "Bearer kjghlijhgjhlkjkjlgbhkghjhjkhh"
            }
        }

        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        }

        const next = jest.fn()

        await adminAuthorization(req, res, next)
        expect(res.status).toHaveBeenCalledWith(401)
        expect(res.json).toHaveBeenCalledWith({error: 'Restricted access'})
    })

    it('should call next() if decodedToken is an admin', async()=>{
        
        const decodedToken = {is_admin: 1}

        verifySpy.mockImplementation((token, secret, callback)=>{
            callback(null, decodedToken)
        })
        
        const req = {
            headers: {
                authorization: "Bearer kjghlijhgjhlkjkjlgbhkghjhjkhh"
            }
        }

        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        }

        const next = jest.fn()

        await adminAuthorization(req, res, next)
        expect(verifySpy).toHaveBeenCalledTimes(1)
        expect(next).toHaveBeenCalled()
        expect(res.status).not.toHaveBeenCalled()
        expect(res.json).not.toHaveBeenCalled()
    })

}) 