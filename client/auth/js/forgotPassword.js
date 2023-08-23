const email = document.querySelector('#email')
const btn = document.querySelector("#btn")

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

btn.addEventListener('click', ()=>{
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

    axios.post('http://127.0.0.1:8080/api/shopie/v1//customer/forgot-password', {
        email: email.value
    })
    .then((response)=>{
        if(response.status == 200){
            window.location.href = `./resetToken.html?email=${email.value}`
        }
    })
    .catch((e)=>{
        if(!e.response){
            handleSubmissionError(e.message)
        }else{
            handleSubmissionError(e.response.data.error)
        }
    })
})