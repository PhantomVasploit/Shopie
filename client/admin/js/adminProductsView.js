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

const tbody = document.querySelector('#productsTableBody')

// fetch all products
axios.get('http://127.0.0.1:8080/api/shopie/v1/products')
.then((response)=>{
    response.data.products.forEach((product, i)=>{

        const tr = document.createElement('tr')
        const productNameEl = document.createElement('td')
        productNameEl.textContent = product.product_name
        const productDescriptionEl = document.createElement('td')
        productDescriptionEl.textContent = product.description
        const quantityEl = document.createElement('td')
        quantityEl.textContent = product.quantity
        const productPriceEl = document.createElement('td')
        productPriceEl.textContent = `KSH ${product.price}`
        const updateBtnCol = document.createElement('td')
        const updateBtn = document.createElement('button')
        const updateIcon = document.createElement('i')
        updateIcon.classList.add('fas')
        updateIcon.classList.add('fa-edit')
        updateBtn.appendChild(updateIcon)
        updateBtn.textContent = "update"
        updateBtn.classList.add(`update-btn-${i}`)
        updateBtnCol.appendChild(updateBtn)
        const deleteBtnCol = document.createElement('td')
        const deleteBtn = document.createElement('button')
        const deleteBtnIcon = document.createElement('i')
        deleteBtnIcon.classList.add('fas')
        deleteBtnIcon.classList.add('fa-trash-alt')
        deleteBtn.appendChild(deleteBtnIcon)
        deleteBtn.textContent = 'delete'
        deleteBtn.classList.add('delete-btn')
        deleteBtnCol.appendChild(deleteBtn)

        updateBtn.addEventListener('click', ()=>{
            window.location.href = `./adminEditProduct.html?product=${JSON.stringify(product)}`
        })

        deleteBtn.addEventListener('click', ()=>{
            axios.delete(`http://127.0.0.1:8080/api/shopie/v1/products/${product.id}`, 
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
                    stopOnFocus: true,
                    gravity: "top",
                    position: "center",
                  }).showToast();
                  window.location.reload()
            })
            .catch((e)=>{
                if(!e.response){
                    handleSubmissionError(e.message)
                }else{
                    handleSubmissionError(e.response.data.error)
                }
            })
        })

        tr.appendChild(productNameEl)
        tr.appendChild(productDescriptionEl)
        tr.appendChild(quantityEl)
        tr.appendChild(productPriceEl)
        tr.appendChild(updateBtnCol)
        tr.appendChild(deleteBtnCol)

        tbody.appendChild(tr)
    })
})
.catch((e)=>{
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