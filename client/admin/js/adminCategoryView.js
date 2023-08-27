const token = localStorage.token 
let user = localStorage.user

function checkData(){
    if(!user || !token){
        window.location.href = '../../auth/html/login.html'
    }
}

window.onload = checkData