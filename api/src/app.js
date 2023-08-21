const cors = require('cors')
const helmet = require('helmet')
const morgan = require('morgan')
const express = require('express')
const bodyParser = require('body-parser')
const { productRouter } = require('./productsRouter/routes')
require('dotenv').config()



const app  = express()
const port = process.env.PORT


app.use(cors())
app.use(helmet())
app.use(morgan('tiny'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))

app.use('/products', productRouter)


app.listen(port, ()=>{
    console.log(`Shopie API server running on http://127.0.0.1:${port}/api/v1/`);
})