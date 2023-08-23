const firstName = document.querySelector('#first-name')
const lastName = document.querySelector('#last-name')
const email = document.querySelector('#email')
const password = document.querySelector('#password')
const phoneNumber = document.querySelector('#phone-number')
const profilePicture = document.querySelector('#profile-picture')

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


document.querySelector('#register-form').addEventListener('submit', (e)=>{
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

    const passwordErrorMessage = document.querySelector('.password-error')
    if(password.value == ''){
        password.style.border = "1px solid red"
        passwordErrorMessage.innerHTML = "Please enter your password"
        passwordErrorMessage.style.color = "red"
        passwordErrorMessage.style.display = "block"
        passwordErrorMessage.style.padding = "5px"

        password.addEventListener('input', ()=>{
            password.style.border = ".5px solid black"
            passwordErrorMessage.innerHTML = ""
            passwordErrorMessage.style.color = "black"
            passwordErrorMessage.style.display = "none"                    
        })
    }

    const phoneNumberErrorMessage = document.querySelector('.phone-number-error')
    if(password.value == ''){
        phoneNumber.style.border = "1px solid red"
        phoneNumberErrorMessage.innerHTML = "Please enter your phone number"
        phoneNumberErrorMessage.style.color = "red"
        phoneNumberErrorMessage.style.display = "block"
        phoneNumberErrorMessage.style.padding = "5px"

        password.addEventListener('input', ()=>{
            phoneNumber.style.border = ".5px solid black"
            phoneNumberErrorMessage.innerHTML = ""
            phoneNumberErrorMessage.style.color = "black"
            phoneNumberErrorMessage.style.display = "none"                    
        })
    }

    const profilePictureErrorMessage = document.querySelector('.profile-picture-error')
    if(password.value == ''){
        profilePicture.style.border = "1px solid red"
        profilePictureErrorMessage.innerHTML = "Please enter your phone number"
        profilePictureErrorMessage.style.color = "red"
        profilePictureErrorMessage.style.display = "block"
        profilePictureErrorMessage.style.padding = "5px"

        password.addEventListener('input', ()=>{
            profilePicture.style.border = ".5px solid black"
            profilePictureErrorMessage.innerHTML = ""
            profilePictureErrorMessage.style.color = "black"
            profilePictureErrorMessage.style.display = "none"                    
        })
    }

    // save image to cloudinary
    
    // profilePicture.addEventListener('change', function (event) {
    //     // This function will be called when the user selects a file
    //     const selectedFile = event.target.files[0];
    
    //     // You can now work with the selected file, for example, you can access its name:
    //     console.log(`Selected file name: ${selectedFile.name}`);
    // });

    profilePicture.addEventListener('change', (event)=>{
        const files = event.target.files
        
        if(files){
            const formData = new FormData()
            formData.append("file", files[0])
            formData.append("upload_preset", "Shopie")
            formData.append("cloud_name", "dx3mq7rzr")

            console.log(formData);

            axios.post('https://api.cloudinary.com/v1_1/dx3mq7rzr/image/upload', 
            {
                formData
            })
            .then((response)=>{
                console.log(response);
            })
            .catch((e)=>{
                console.log(e.message);
            })
        }
    })

    // if(firstName.value && lastName.value && email.value && password.value){

    //     axios.post('http://127.0.0.1:8080/api/shopie/v1/customer/register', 
    //     {
    //         firstName: firstName.value,
    //         lastName: lastName.value,
    //         email: email.value,
    //         password: password.value
    //     })
    //     .then((response)=>{
    //         Toastify({
    //             text: response.data.message,
    //             backgroundColor: "#4caf50", // Custom success color
    //             duration: 3000, // Time in milliseconds before the toast auto-closes
    //             close: true,
    //             gravity: "top",
    //             position: "success",
    //           }).showToast();
    //           window.location.href = './login.html'
    //     })
    //     .catch((e)=>{
    //         if(!e.response){
    //             handleSubmissionError(e.message)
    //         }else{
    //             handleSubmissionError(e.response.data.error)
    //         }
    //     })
    // }


})
