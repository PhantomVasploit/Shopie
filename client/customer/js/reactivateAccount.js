const urlParams = new URLSearchParams(window.location.search)
const email = urlParams.get('email')

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

let btn = document.querySelector('#act-btn')
let passwordEl = document.querySelector('#password')
btn.addEventListener('click', ()=>{
    axios.put('http://127.0.0.1:8080/api/shopie/v1/customer/reactivate-account', 
    {
        email: email,
        password: passwordEl.value
    },
    {
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then((response)=>{
        window.location.href = '../../auth/html/login.html'
    })  
    .catch((e)=>{
        if(!e.response){
            handleSubmissionError(e.message)
        }else{
            handleSubmissionError(e.response.data.error)
        }
    })      
})  