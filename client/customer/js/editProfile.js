const token = localStorage.token 
let user = localStorage.user

function checkData(){
    if(!user || !token){
        window.location.href = '../../auth/html/login.html'
    }
}

window.onload = checkData
user = JSON.parse(localStorage.user)

const firstName = document.querySelector('#first-name')
const lastName = document.querySelector('#last-name')
const email = document.querySelector('#email')
const phoneNumber = document.querySelector('#phone-number')
const profilePicture = document.querySelector('#profile-picture')

firstName.value = user.first_name
lastName.value = user.last_name
email.value = user.email
phoneNumber.value = user.phone_number

let profilePictureUrl = ''

function handleSubmissionError(message){
    Toastify({
            text: message,
            duration: 5000, // Display duration in milliseconds
            backgroundColor: "#f44336",
            close: true,
            stopOnFocus: true,
            gravity: "top", // Position of the notification
            position: "center", // Alignment of the notification
        }).showToast();
}

profilePicture.addEventListener('change', (e)=>{
    const files = e.target.files
    if(files){
        const formData = new FormData()
        formData.append("file", files[0])
        formData.append("upload_preset", "Shopie")
        formData.append("cloud_name", "dx3mq7rzr")


        fetch('https://api.cloudinary.com/v1_1/dx3mq7rzr/image/upload', {
            method: "POST",
            body: formData
        })
        .then((res)=>{
            res.json()
            .then((response)=>{
                profilePictureUrl = response.url
                
            })
            .catch((e)=>{
                if(!e.response){
                    handleSubmissionError(e.message)
                }else{
                    handleSubmissionError(e.response.data.error)
                }
            })
        })
    } 
})



document.querySelector('#register-form').addEventListener('submit', async(e)=>{
    e.preventDefault()
    
    const firstNameErorMessage = document.querySelector('.first-name-error')
    if(firstName.value == ''){
        firstName.style.border = "1px solid red"
        firstNameErorMessage.innerHTML = "Please enter your first name"
        firstNameErorMessage.style.color = "red"
        firstNameErorMessage.style.display = "block"
        firstNameErorMessage.style.padding = "5px"

        firstName.addEventListener('input', ()=>{
            firstName.style.border = ".5px solid black"
            firstNameErorMessage.innerHTML = ""
            firstNameErorMessage.style.color = "black"
            firstNameErorMessage.style.display = "none"                    
        })
    }

    const lasttNameErorMessage = document.querySelector('.last-name-error')
    if(lastName.value == ''){
        lastName.style.border = "1px solid red"
        lasttNameErorMessage.innerHTML = "Please enter your last name"
        lasttNameErorMessage.style.color = "red"
        lasttNameErorMessage.style.display = "block"
        lasttNameErorMessage.style.padding = "5px"

        lastName.addEventListener('input', ()=>{
            lastName.style.border = ".5px solid black"
            lasttNameErorMessage.innerHTML = ""
            lasttNameErorMessage.style.color = "black"
            lasttNameErorMessage.style.display = "none"                    
        })
    }


    const emailErorMessage = document.querySelector('.email-error')
    if(email.value == ''){
        email.style.border = "1px solid red"
        emailErorMessage.innerHTML = "Please enter your email address"
        emailErorMessage.style.color = "red"
        emailErorMessage.style.display = "block"
        emailErorMessage.style.padding = "5px"

        email.addEventListener('input', ()=>{
            email.style.border = ".5px solid black"
            emailErorMessage.innerHTML = ""
            emailErorMessage.style.color = "black"
            emailErorMessage.style.display = "none"                    
        })
    }


    const phoneNumberErrorMessage = document.querySelector('.phone-number-error')
    if(phoneNumber.value == ''){
        phoneNumber.style.border = "1px solid red"
        phoneNumberErrorMessage.innerHTML = "Please enter your phone number"
        phoneNumberErrorMessage.style.color = "red"
        phoneNumberErrorMessage.style.display = "block"
        phoneNumberErrorMessage.style.padding = "5px"

        phoneNumber.addEventListener('input', ()=>{
            phoneNumber.style.border = ".5px solid black"
            phoneNumberErrorMessage.innerHTML = ""
            phoneNumberErrorMessage.style.color = "black"
            phoneNumberErrorMessage.style.display = "none"                    
        })
    }

    const profilePictureErrorMessage = document.querySelector('.profile-picture-error')
    if(profilePicture.value == ''){
        profilePicture.style.border = "1px solid red"
        profilePictureErrorMessage.innerHTML = "Please select a profile picture"
        profilePictureErrorMessage.style.color = "red"
        profilePictureErrorMessage.style.display = "block"
        profilePictureErrorMessage.style.padding = "5px"

        profilePicture.addEventListener('change', (e)=>{
            console.log(e);
            profilePicture.style.border = ".5px solid black"
            profilePictureErrorMessage.innerHTML = ""
            profilePictureErrorMessage.style.color = "black"
            profilePictureErrorMessage.style.display = "none"                    
        })
    }

    
    
    

    if(firstName.value && lastName.value && email.value && phoneNumber.value && profilePictureUrl){

        axios.put(`http://127.0.0.1:8080/api/shopie/v1/customer/${user.id}`, 
        {
            firstName: firstName.value,
            lastName: lastName.value,
            email: email.value,
            phoneNumber: phoneNumber.value,
            profilePicture: profilePictureUrl
        },
        {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        })
        .then((response)=>{
            Toastify({
                text: response.data.message,
                backgroundColor: "#4caf50", // Custom success color
                duration: 3000, // Time in milliseconds before the toast auto-closes
                close: true,
                gravity: "top",
                position: "success",
              }).showToast();
              window.location.href = '../../auth/html/login.html'
        })
        .catch((e)=>{
            if(!e.response){
                handleSubmissionError(e.message)
            }else{
                handleSubmissionError(e.response.data.error)
            }
        })
    }


})