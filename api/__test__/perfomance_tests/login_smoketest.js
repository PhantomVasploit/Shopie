import http from 'k6/http'
import {sleep, check} from 'k6'

export const options ={
    vus: 5,
    duration: '1m'
}

export default function(){
    const url = 'http://127.0.0.1:8080/api/shopie/v1/customer/login'
    const body = JSON.stringify({
        email: 'tanjiro@gmail.com',
        password: 'Microlab3'
    })

    const params = {
        headers: {
            'Content-Type': 'application/json'
        }   
    }

    const response = http.post(url, body, params)

    check(response, {
        'is status 200': (res)=>res.status === 200,
        'is successfully logged in': (res)=> res.body.includes('Login successful')
    })
}