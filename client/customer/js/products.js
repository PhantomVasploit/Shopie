const token = localStorage.token 
let user = localStorage.user

function checkData(){
    if(!user || !token){
        window.location.href = '../../auth/html/login.html'
    }
}

window.onload = checkData
user = JSON.parse(localStorage.user)

let cart = []
const urlParams = new URLSearchParams(window.location.search)
const category = urlParams.get('category')
const title = document.querySelector('#title')
const productContainer = document.querySelector('.products-container')
const cartIcon = document.querySelector('#cartIcon')


title.innerHTML = category;


cartIcon.addEventListener('click', ()=>{
    window.location.href = './viewCart.html'
})

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

axios.get(`http://127.0.0.1:8080/api/shopie/v1/category/${category}`)
.then((response)=>{  
      response.data.products.forEach((product)=>{
        const productEl = document.createElement('div')
        productEl.classList.add("products")

        const containerDiv = document.createElement('div')
        const productImageEl = document.createElement('img')
        productImageEl.src = product.image
        const productNameEl = document.createElement('p')
        productImageEl.textContent = product.product_name
        const productDescriptionEl = document.createElement("small")
        productDescriptionEl.textContent = product.description

        const infoDiv = document.createElement("div")
        infoDiv.classList.add("info")
        const productPrice = document.createElement('p')
        productPrice.textContent = `KSH: ${product.price}`
        const productQuantity = document.createElement('p')
        productQuantity.textContent = `Quantity: ${product.quantity}`
        infoDiv.appendChild(productPrice)
        infoDiv.appendChild(productQuantity)

        const btnDiv = document.createElement("div")
        btnDiv.classList.add('btn')
        const addToCartBtn = document.createElement("button")
        addToCartBtn.textContent = "Add to cart"
        addToCartBtn.classList.add('btn')

        addToCartBtn.addEventListener('click', ()=>{
            cart = JSON.parse(localStorage.cart)  || []
            
            const productInCart = cart.find(item => item.id === product.id)

            if(productInCart){
                Toastify({
                    text: "Item already in the cart",
                    backgroundColor: "#f44336", // Custom success color
                    duration: 3000, // Time in milliseconds before the toast auto-closes
                    close: true,
                    stopOnFocus: true,
                    gravity: "top",
                    position: "center",
                  }).showToast();
            }else{
                cart.push(product)
                localStorage.cart = JSON.stringify(cart)
                Toastify({
                    text: "item added to cart",
                    backgroundColor: "#4caf50", // Custom success color
                    duration: 3000, // Time in milliseconds before the toast auto-closes
                    close: true,
                    stopOnFocus: true,
                    gravity: "top",
                    position: "center",
                  }).showToast();
            }


        })
        btnDiv.appendChild(addToCartBtn)



        
        containerDiv.appendChild(productImageEl)
        containerDiv.appendChild(productNameEl)
        containerDiv.appendChild(productDescriptionEl)
        containerDiv.appendChild(infoDiv)
        containerDiv.appendChild(btnDiv)

        productEl.appendChild(containerDiv)
        productContainer.appendChild(productEl)
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


const search = document.querySelector('#search')
search.addEventListener('input', ()=>{
  
    const searchTerm = search.value.toLowerCase(); 

    axios.get(`http://127.0.0.1:8080/api/shopie/v1/category/${category}`)
    .then((response)=>{  
        
        const filtered = response.data.products.filter((product) => {
            return product.product_name.toLowerCase().includes(searchTerm);
        });

        


        productContainer.innerHTML = ""

        filtered.forEach((product)=>{
            const productEl = document.createElement('div')
            productEl.classList.add("products")

            const containerDiv = document.createElement('div')
            const productImageEl = document.createElement('img')
            productImageEl.src = product.image
            const productNameEl = document.createElement('p')
            productImageEl.textContent = product.product_name
            const productDescriptionEl = document.createElement("small")
            productDescriptionEl.textContent = product.description

            const infoDiv = document.createElement("div")
            infoDiv.classList.add("info")
            const productPrice = document.createElement('p')
            productPrice.textContent = `KSH: ${product.price}`
            const productQuantity = document.createElement('p')
            productQuantity.textContent = `Quantity: ${product.quantity}`
            infoDiv.appendChild(productPrice)
            infoDiv.appendChild(productQuantity)

            const btnDiv = document.createElement("div")
            btnDiv.classList.add('btn')
            const addToCartBtn = document.createElement("button")
            addToCartBtn.textContent = "Add to cart"
            addToCartBtn.addEventListener('click', ()=>{
                cart = JSON.parse(localStorage.cart)  || []
                
                const productInCart = cart.find(item => item.id === product.id)

                if(productInCart){
                    Toastify({
                        text: "Item already in the cart",
                        backgroundColor: "#f44336", // Custom success color
                        duration: 3000, // Time in milliseconds before the toast auto-closes
                        close: true,
                        stopOnFocus: true,
                        gravity: "top",
                        position: "center",
                    }).showToast();
                }else{
                    cart.push(product)
                    localStorage.cart = JSON.stringify(cart)
                    Toastify({
                        text: "item added to cart",
                        backgroundColor: "#4caf50", // Custom success color
                        duration: 3000, // Time in milliseconds before the toast auto-closes
                        close: true,
                        stopOnFocus: true,
                        gravity: "top",
                        position: "center",
                    }).showToast();
                }


            })
            btnDiv.appendChild(addToCartBtn)



            
            containerDiv.appendChild(productImageEl)
            containerDiv.appendChild(productNameEl)
            containerDiv.appendChild(productDescriptionEl)
            containerDiv.appendChild(infoDiv)
            containerDiv.appendChild(btnDiv)

            productEl.appendChild(containerDiv)
            productContainer.appendChild(productEl)
        })

        
    })
    .catch((e)=>{
        if(!e.response){
            handleSubmissionError(e.message)
        }else{
            handleSubmissionError(e.response.data.error)
        }
    })

    
})