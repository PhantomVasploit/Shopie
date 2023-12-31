const express = require('express')
const cron = require('node-cron')
require('dotenv').config()

const { welcomeEmail } = require('./email_service/user_email_service')

const app = express()
const port = process.env.PORT

cron.schedule('*/10 * * * * *', ()=>{
    welcomeEmail()
})

app.listen(port, ()=>{
    console.log(`Account verification running on port: ${port}`);
})