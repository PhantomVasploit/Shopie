import mssql from 'mssql'

const { addProduct, fetchAllProducts, fetchOneProduct, updateProduct, deleteProject, fetchCategory } = require('../productsController/productController');


const res = {json: jest.fn()}




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

            const pool = jest.spyOn(mssql, "connect").mockResolvedValueOnce({
                connected: true,
                request: jest.fn().mockReturnThis(),
                input: jest.fn().mockReturnThis(),
                execute: jest.fn().mockResolvedValueOnce({
                    rowsAffected: 1
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
        const res = {json: jest.fn()}

        // acts as students list
        const mockedProducts = [{
            "product": {
              "id": "cbb99d1b-7072-4004-801d-b1da030ebc21",
              "product_name": "Gucci Embroidered Fabric Handbag",
              "image": "https://hips.hearstapps.com/hmg-prod/images/guest-wears-a-black-and-dark-gray-print-pattern-coat-black-news-photo-1674570282.jpg?resize=1200:*",
              "category": "bags",
              "description": "If I had my way, I'd devote at least half my closet to Prada totes.",
              "price": 2000
            }
          }]

        const req = {}

        jest.spyOn(mssql, "connect").mockResolvedValueOnce({
            connected: true,
            request: jest.fn().mockReturnThis(),
            execute: jest.fn().mockResolvedValueOnce({
                recordset: mockedProducts
            })
        })

        await fetchAllProducts(req,res)

        

        // expect(res.status).toHaveBeenCalledWith(200)
        expect(res.json).toHaveBeenCalledWith({"projects": mockedProducts})

        res.json.mockRestore()
    })

    // if no products found or handle any errors of no product is provided


})


describe("delete product(S)",()=>{

    it("should return a message for successful deletion of product(S)", async()=>{
        const mockedProductId = 'new-product-id'
        
        const body = {
            product_ids:[
                "57e1e28c-3b15-4486-befc-d93127497a7e"
            ]
        }
        const req = {
            body:body
        }

        jest.spyOn(mssql, "connect").mockResolvedValueOnce({
            request: jest.fn().mockReturnThis(),
            input: jest.fn().mockReturnThis(),
            execute: jest.fn().mockResolvedValueOnce({
                rowsAffected: [1]
            })
        })

        await deleteProject(req, res)

        expect(res.json).toHaveBeenCalledWith({
            message: '1 product(s) deleted successfully'
        })

        res.json.mockRestore()
    })

    it("should return a message for failed deletion of product(s)", async () => {
        const body = {
            product_ids: [
                "another-product-id"
            ]
        };

        const req = {
            body: body
        };

        const res = {
            json: jest.fn()
        };

        const poolMock = {
            request: jest.fn().mockReturnThis(),
            input: jest.fn().mockReturnThis(),
            execute: jest.fn().mockResolvedValueOnce({
                rowsAffected: [0] // Simulate failed deletion
            })
        };

        jest.spyOn(mssql, "connect").mockResolvedValueOnce(poolMock);

        await deleteProject(req, res);

        expect(res.json).toHaveBeenCalledWith({
            message: '1 product(s) out of 1 failed deletion'
        });

        res.json.mockRestore()
    });

})


describe("update product details",()=>{

    // const res = {json: jest.fn()}

    it("should return a message for successful product update", async ()=>{
        const res = {json: jest.fn()}

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
        console.log(res);
        console.log(res.json);

        // res.json.mockRestore()


    })

    it("should return a message id doesnt exist", async()=>{

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
            message: "product not found"
        })

        res.json.mockRestore()


    })

})


describe("fetch products by category",()=>{
    it("should return products based on specified category",async ()=>{
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

        const mockedCategory = 'product_id'


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

        expect(res.json).toHaveBeenCalledWith({products:  [mockedProduct] })

        res.json.mockRestore()
    })
})