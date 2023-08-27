const token = localStorage.token 
let user = localStorage.user

function checkData(){
    if(!user || !token){
        window.location.href = '../../auth/html/login.html'
    }
}

window.onload = checkData
user = JSON.parse(localStorage.user)

const cartIcon = document.querySelector('#cartIcon')
cartIcon.addEventListener('click', ()=>{
    window.location.href = './viewCart.html'
})

const viewCart = document.querySelector('.view-cart')
const subTotalEl = document.querySelector('#sub-total')
const totalCost = document.querySelector('#total-cost')
const checkOutBtn = document.querySelector('#check-out')
const logoutBtn = document.querySelector('#logout')

let cart = JSON.parse(localStorage.cart)
let orders = []

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

cart.forEach((order)=>{
    let { product_name, image, category, description, ...payload } = order
    payload.quantity = 1;
    orders.push(payload)
    console.log(orders);
    const cartItem = document.createElement('div')
    cartItem.classList.add('cart-item')

    const cartImageDiv = document.createElement('div')
    cartImageDiv.classList.add('img')
    const cartImage = document.createElement('img')
    cartImage.src = order.image
    cartImageDiv.appendChild(cartImage)

    const itemDetailsDiv = document.createElement('item-details')
    const headingEl = document.createElement('h5')
    headingEl.textContent = order.product_name
    const removeBtn = document.createElement('button')
    removeBtn.textContent = 'REMOVE'
    itemDetailsDiv.appendChild(headingEl)
    itemDetailsDiv.appendChild(removeBtn)

    removeBtn.addEventListener('click', ()=>{
        cart = cart.filter((item)=> item.id !== order.id)
        localStorage.cart = JSON.stringify(cart)
        window.location.reload()
    })

    const itemControlEl = document.createElement('div')
    itemControlEl.classList.add('item-control')
    const itemControlInnerDiv = document.createElement('div')
    const addBtn = document.createElement('button')
    const addSign = document.createElement('i')
    const quantityEl = document.createElement('p')
    const reduceBtn = document.createElement('button')
    const minusSign = document.createElement('i')
    quantityEl.textContent = 1
    addSign.classList.add('fas')
    addSign.classList.add('fa-minus')
    addBtn.append(addSign)
    minusSign.classList.add('fas')
    minusSign.classList.add('fa-plus')
    reduceBtn.appendChild(minusSign)

    reduceBtn.addEventListener('click', ()=>{
        quantityEl.textContent = parseInt(quantityEl.textContent) + 1
        let orderInOrders = orders.find((item)=>item.id == order.id)
        orderInOrders.quantity = quantityEl.textContent
        orders[orders.indexOf(orderInOrders)] = orderInOrders
        updateTotal()
    })

    addBtn.addEventListener('click', ()=>{
        if(parseInt(quantityEl.textContent) == 1){
            Toastify({
                text: "Can not reduce order quatity beyond 1",
                backgroundColor: "#f44336", // Custom success color
                duration: 3000, // Time in milliseconds before the toast auto-closes
                close: true,
                stopOnFocus: true,
                gravity: "top",
                position: "center",
              }).showToast();
        }else{
            quantityEl.textContent = parseInt(quantityEl.textContent) - 1
            let orderInOrders = orders.find((item)=>item.id == order.id)
            orderInOrders.quantity = quantityEl.textContent
            orders[orders.indexOf(orderInOrders)] = orderInOrders
            updateTotal()
        }
    })

    itemControlInnerDiv.appendChild(addBtn)
    itemControlInnerDiv.appendChild(quantityEl)
    itemControlInnerDiv.appendChild(reduceBtn)

    const priceEl = document.createElement('p')
    priceEl.textContent = `KSH: ${order.price}`
    priceEl.style.marginTop = '6px'
    itemControlEl.appendChild(itemControlInnerDiv)
    itemControlEl.appendChild(priceEl)

    cartItem.appendChild(cartImageDiv)
    cartItem.appendChild(itemDetailsDiv)
    cartItem.appendChild(itemControlEl)

    
    
    viewCart.appendChild(cartItem)
    
})


function updateTotal(){
    let subTotal = 0
    orders.forEach((order)=>{
        subTotal += (order.quantity * order.price)
        subTotalEl.textContent = subTotal
    })

    totalCost.textContent = parseInt(subTotalEl.textContent) + 500

}

updateTotal()

checkOutBtn.addEventListener('click', ()=>{

    orders.forEach((order)=>{
        axios.post(`http://127.0.0.1:8080/api/shopie/v1/order/${user.id}/${order.id}`, 
        {
            quantity: order.quantity
        },
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
            if(!e.response){
                handleSubmissionError(e.message)
            }else{
                handleSubmissionError(e.response.data.error)
            }
        })
    })

    window.location.href = './productCategories.html'

})

logoutBtn.addEventListener('click', ()=>{
    localStorage.user = ''
    localStorage.token = ''
    window.location.href = '../../auth/html/login.html'
})