const token = localStorage.token 
let user = localStorage.user

function checkData(){
    if(!user || !token){
        window.location.href = '../../index.html'
    }
}

window.onload = checkData
user = JSON.parse(localStorage.user)

const email = document.querySelector('.email')
const nameHtml = document.querySelector('.name')
const profileImage = document.querySelector('.image')

nameHtml.innerHTML = `
    <h2>${user.first_name} ${user.last_name}</h2>
    <p>${user.email}</p>
`
profileImage.innerHTML = `
    <img style="border-radius: 50%;" src="${user.profile_picture}" alt="">
`
email.innerHTML = `
    <h4>Email</h4>
    <p>${user.email}</p>
`