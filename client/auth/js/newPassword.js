const urlParams = new URLSearchParams(window.location.search)

const email = urlParams.get('email')
const password = document.querySelector('#password')
const btn = document.querySelector("#btn")

console.log(email);

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
    const passwordErorMessage = document.querySelector('.password-error')
    if(password.value == ''){
        password.style.border = "1px solid red"
        passwordErorMessage.innerHTML = "Please enter your email address"
        passwordErorMessage.style.color = "red"
        passwordErorMessage.style.display = "block"
        passwordErorMessage.style.padding = "5px"

        password.addEventListener('input', ()=>{
            password.style.border = ".5px solid black"
            passwordErorMessage.innerHTML = ""
            passwordErorMessage.style.color = "black"
            passwordErorMessage.style.display = "none"                    
        })
    }

    axios.post('http://127.0.0.1:8080/api/shopie/v1/customer/reset-password', {
        email,
        password: password.value
    })
    .then((response)=>{
        console.log(response);
        if(response.status == 200){
            window.location.href = `./login.html`
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