const token = localStorage.token 
let user = localStorage.user

function checkData(){
    if(!user || !token){
        window.location.href = '../../auth/html/login.html'
    }
}

window.onload = checkData
user = JSON.parse(localStorage.user)

function handleSubmissionError(message){
    Toastify({
            text: message,
            duration: 3000, // Display duration in milliseconds
            backgroundColor: "#f44336",
            close: true,
            stopOnFocus: true,
            gravity: "top", // Position of the notification
            position: "center", // Alignment of the notification
        }).showToast();
}

const tbody = document.querySelector("#tbody")

axios.get('http://127.0.0.1:8080/api/shopie/v1/customers', 
{
    headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    }
})
.then((response)=>{
    response.data.customers.forEach((customer)=>{
        
        const tr = document.createElement('tr')

        const tdName = document.createElement('td')
        tdName.textContent = `${customer.first_name} ${customer.last_name}`

        const tdEmail = document.createElement('td')
        tdEmail.textContent = customer.email

        const tdPhoneNumber = document.createElement('td')
        tdPhoneNumber.textContent = customer.phone_number

        const tdDeleteBtn = document.createElement('td')
        const deletBtn = document.createElement('button')
        const i = document.createElement('i')
        i.classList.add('fas')
        i.classList.add('fa-user-slash')
        deletBtn.appendChild(i)
        deletBtn.textContent = "suspend"
        deletBtn.classList.add('delete-btn')
        tdDeleteBtn.appendChild(deletBtn)

        deletBtn.addEventListener('click', ()=>{
            axios.delete(`http://127.0.0.1:8080/api/shopie/v1/customer/${customer.id}`, 
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer: ${token}`
                }
            })
            .then((response)=>{
                Toastify({
                    text: response.data.message,
                    backgroundColor: "#4caf50", // Custom success color
                    duration: 3000, // Time in milliseconds before the toast auto-closes
                    close: true,
                    stopOnFocus: true,
                    gravity: "top",
                    position: "center",
                  }).showToast();
            })
            .catch((e)=>{
                console.log(e.message);
                if(!e.response){
                    handleSubmissionError(e.message)
                }else{
                    handleSubmissionError(e.response.data.error)
                }
            })
        })

        tr.appendChild(tdName)
        tr.appendChild(tdEmail)
        tr.appendChild(tdPhoneNumber)
        tr.appendChild(tdDeleteBtn)

        tbody.appendChild(tr)

    })
})
.catch((e)=>{
    console.log(e.message);
    if(!e.response){
        handleSubmissionError(e.message)
    }else{
        handleSubmissionError(e.response.data.error)
    }
})

const logoutBtn = document.querySelector('#logout')

logoutBtn.addEventListener('click', ()=>{
    localStorage.user = ''
    localStorage.token = ''
    window.location.href = '../../auth/html/login.html'
})

