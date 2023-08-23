const urlParams = new URLSearchParams(window.location.search)

const email = urlParams.get('email')
const token = document.querySelector('#token')
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
    const tokenErorMessage = document.querySelector('.token-error')
    if(token.value == ''){
        token.style.border = "1px solid red"
        tokenErorMessage.innerHTML = "Please enter your email address"
        tokenErorMessage.style.color = "red"
        tokenErorMessage.style.display = "block"
        tokenErorMessage.style.padding = "5px"

        token.addEventListener('input', ()=>{
            token.style.border = ".5px solid black"
            tokenErorMessage.innerHTML = ""
            tokenErorMessage.style.color = "black"
            tokenErorMessage.style.display = "none"                    
        })
    }

    axios.post('http://127.0.0.1:8080/api/shopie/v1/customer/verify-token', {
        email,
        token: token.value
    })
    .then((response)=>{
        console.log(response);
        if(response.status == 200){
            window.location.href = `./newPassword.html?email=${email}`
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