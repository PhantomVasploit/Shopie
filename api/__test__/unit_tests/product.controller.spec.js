// import mssql from 'mssql'
const mssql = require('mssql')

const { addProduct, fetchAllProducts, fetchOneProduct, updateProduct, deleteProject, fetchCategory } = require('../../src/controller/product.controller');







describe('add a new product',()=>{


    it('should return a success message on adding product', async ()=>{
            const req = {
                body: {
                    product_name: "Gucci Embroidered Fabric Handbag",
                    description: "If I had my way, I'd devote at least half my closet to Prada totes." ,
                    category: "bags",
                    price: 2000,
                    image: "https://hips.hearstapps.com/hmg-prod/images/guest-wears-a-black-and-dark-gray-print-pattern-coat-black-news-photo-1674570282.jpg?resize=1200:*",
                    quantity: 1
                }
            }
            const res = { status: jest.fn().mockReturnThis(), json: jest.fn()}

            const pool = jest.spyOn(mssql, "connect").mockResolvedValueOnce({
                connected: true,
                request: jest.fn().mockReturnThis(),
                input: jest.fn().mockReturnThis(),
                execute: jest.fn().mockResolvedValueOnce({
                    rowsAffected: [1]
                })
            })
 
            await addProduct(req,res)

            // expect(res.status).toHaveBeenCalledWith(200)

            expect(res.json).toHaveBeenCalledWith({
                message: "Product adding completed successfully"
            })


            res.json.mockRestore()
            

    })

    // verify input received

    it('should verify all input fields are filled',async function(){

        const body = {
            product_name: "Gucci Embroidered Fabric Handbag",
        }

        const request = {body:body}

        const res = { status: jest.fn().mockReturnThis(), json: jest.fn()}

        await addProduct(request,res)

        expect(res.json).toHaveBeenCalledWith({
            message: "please input fields"
        })

        res.json.mockRestore()


    })
})


describe("fetching a single product",()=>{

    it(" should return product details for requested roduct",async()=>{

        const mockedProduct =  {
            "product": {
              "id": "cbb99d1b-7072-4004-801d-b1da030ebc21",
              "product_name": "Gucci Embroidered Fabric Handbag",
              "image": "https://hips.hearstapps.com/hmg-prod/images/guest-wears-a-black-and-dark-gray-print-pattern-coat-black-news-photo-1674570282.jpg?resize=1200:*",
              "category": "bags",
              "description": "If I had my way, I'd devote at least half my closet to Prada totes.",
              "price": 2000
            }
          }

        const mockedProductId = 'product_id'


        const req = {
            params: {
                id: mockedProductId
            }
        }

        const res = { status: jest.fn().mockReturnThis(), json: jest.fn()}

        jest.spyOn(mssql, "connect").mockResolvedValueOnce({
            request: jest.fn().mockReturnThis(),
            input: jest.fn().mockReturnThis(),
            execute: jest.fn().mockResolvedValueOnce({
                recordset: [mockedProduct]
            })
        })

        await fetchOneProduct(req, res)

        expect(res.json).toHaveBeenCalledWith({product:  mockedProduct })

        res.json.mockRestore()


    })

})






describe("fetching all products",()=>{

    
    it('should fetch all products',async()=>{

        // acts as students list
        const mockedProducts = [{
            "id": "cbb99d1b-7072-4004-801d-b1da030ebc21",
            "product_name": "Gucci Embroidered Fabric Handbag",
            "image": "https://hips.hearstapps.com/hmg-prod/images/guest-wears-a-black-and-dark-gray-print-pattern-coat-black-news-photo-1674570282.jpg?resize=1200:*",
            "category": "bags",
            "description": "If I had my way, I'd devote at least half my closet to Prada totes.",
            "price": 2000
          }]

        const req = {}
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn()}

        jest.spyOn(mssql, "connect").mockResolvedValueOnce({
            connected: true,
            request: jest.fn().mockReturnThis(),
            execute: jest.fn().mockResolvedValueOnce({
                recordset: mockedProducts
            })
        })

        await fetchAllProducts(req,res)

        
        expect(res.json).toHaveBeenCalledWith({
            message: 'Fetch successful', 
            products: mockedProducts
        })

        res.json.mockRestore()
    })

    // if no products found or handle any errors of no product is provided


})


describe("delete product(S)",()=>{

    it("should return a message for successful deletion of product(S)", async()=>{
        
        
        const req = {
            params: {
                id: "57e1e28c-3b15-4486-befc-d93127497a7e"
            }
        }

        const res = { status: jest.fn().mockReturnThis(), json: jest.fn()}

        jest.spyOn(mssql, "connect").mockResolvedValueOnce({
            request: jest.fn().mockReturnThis(),
            input: jest.fn().mockReturnThis(),
            execute: jest.fn().mockResolvedValueOnce({
                rowsAffected: [1]
            })
        })

        await deleteProject(req, res)

        expect(res.json).toHaveBeenCalledWith({
            message: 'Product deleted successfully'
        })

        res.json.mockRestore()
    })

})


describe("update product details",()=>{

    

    it("should return a message for successful product update", async ()=>{

        const res = { status: jest.fn().mockReturnThis(), json: jest.fn()}

        const mockedProductId = 'cbb99d1b-7072-4004-801d-b1da030ebc21'

        const body = {
            product_name: "Burkin Embroidered Fabric Handbag",
            description: "If I had my way, I'd devote at least half my closet to Prada totes." ,
            category: "bags",
            price: 2000,
            image: "https://hips.hearstapps.com/hmg-prod/images/guest-wears-a-black-and-dark-gray-print-pattern-coat-black-news-photo-1674570282.jpg?resize=1200:*"
        }

        const req = {
            params:{
                id:mockedProductId
            },
            body:body
        }
        

        jest.spyOn(mssql, "connect").mockResolvedValueOnce({
            connected: true,
            request: jest.fn().mockReturnThis(),
            input: jest.fn().mockReturnThis(),
            execute: jest.fn().mockResolvedValueOnce({
                rowsAffected: [1]
            })
        })



        await updateProduct(req, res);

        expect(res.json).toHaveBeenCalledWith({
                    message: "product updated successfully"
                })

    })

    it("should return a message id doesnt exist", async()=>{

        const res = { status: jest.fn().mockReturnThis(), json: jest.fn()}

        const mockedProductId = '969f9f87-e948-4895-a183'


        const req = {
            params:{
                id:mockedProductId
            },
            body:{
                "product_name": "Burkin Embroidered Fabric Handbag",
                "description": "If I had my way, I'd devote at least half my closet to Prada totes." ,
                "category": "bags",
                "price": 2000,
                "image": "https://hips.hearstapps.com/hmg-prod/images/guest-wears-a-black-and-dark-gray-print-pattern-coat-black-news-photo-1674570282.jpg?resize=1200:*"
            }

        }
        
        

        jest.spyOn(mssql, "connect").mockResolvedValueOnce({
            connected: true,
            request: jest.fn().mockReturnThis(),
            input: jest.fn().mockReturnThis(),
            execute: jest.fn().mockResolvedValueOnce({
                rowsAffected: [0]
            })
        })

        await updateProduct(req, res)

        expect(res.json).toHaveBeenCalledWith({
            error: "product not found"
        })

        res.json.mockRestore()


    })

})


describe("fetch products by category",()=>{
    it("should return products based on specified category",async ()=>{

        const mockedProduct =  [
            {
                "id": "cbb99d1b-7072-4004-801d-b1da030ebc21",
                "product_name": "Gucci Embroidered Fabric Handbag",
                "image": "https://hips.hearstapps.com/hmg-prod/images/guest-wears-a-black-and-dark-gray-print-pattern-coat-black-news-photo-1674570282.jpg?resize=1200:*",
                "category": "bags",
                "description": "If I had my way, I'd devote at least half my closet to Prada totes.",
                "price": 2000
            }
        ]
            

        const mockedCategory = 'product_id'
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn()}

        const req = {
            params: {
                id: mockedCategory
            }
        }

        jest.spyOn(mssql, "connect").mockResolvedValueOnce({
            request: jest.fn().mockReturnThis(),
            input: jest.fn().mockReturnThis(),
            execute: jest.fn().mockResolvedValueOnce({
                recordset: [mockedProduct]
            })
        })

        await fetchCategory(req, res)

        expect(res.json).toHaveBeenCalledWith({products:  [mockedProduct], message: 'Fetch successful' })

        res.json.mockRestore()
    })
})