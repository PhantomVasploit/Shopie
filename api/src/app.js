const cors = require('cors')
const helmet = require('helmet')
const morgan = require('morgan')
const express = require('express')
const bodyParser = require('body-parser')
const swaggerUI = require('swagger-ui-express')
require('dotenv').config()

const app  = express()
const port = process.env.PORT
const routes = require('./routes/routes')
const logger = require('./config/winston.config')
const {errorLogger} = require('./middleware/errorLogger')
const swaggerConfig = require('./config/swagger.config.json')

app.use(cors())
app.use(helmet())
app.use(morgan('tiny'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))

app.use('/api/shopie/v1', routes)
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerConfig))
app.use(errorLogger)

const server = app.listen(port, ()=>{
    logger.info(`Shopie API server running on http://127.0.0.1:${port}/api/shopie/v1/`)
    console.log(`Shopie API server running on http://127.0.0.1:${port}/api/shopie/v1/`);
})

module.exports = server