const token = localStorage.token 
let user = localStorage.user

function checkData(){
    if(!user || !token){
        window.location.href = '../../auth/html/login.html'
    }
}

window.onload = checkData
user = JSON.parse(localStorage.user)

const productName = document.querySelector("#product_name")
const productCategory = document.querySelector("#product_category")
const productDescription = document.querySelector("#product_description")
const productUrl = document.querySelector("#product_url")
const productPrice = document.querySelector("#product_price")
const productQuantity = document.querySelector("#product_quantity")
const submitBtn = document.querySelector("#submitBtn")

let productUrlString = ''

let category = ''

productCategory.addEventListener('change', ()=>{
    category = productCategory.value
})


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

productUrl.addEventListener('change', (e)=>{
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
                productUrlString = response.url
                
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


submitBtn.addEventListener('click', ()=>{

    const productNameError = document.querySelector('.product-name-error')
    if(productName.value == ''){
        productNameError.style.border = "1px solid red"
        productNameError.innerHTML = "Please enter product name"
        productNameError.style.color = "red"
        productNameError.style.display = "block"
        productNameError.style.padding = "5px"

        productName.addEventListener('input', ()=>{
            productName.style.border = ".5px solid black"
            productNameError.innerHTML = ""
            productNameError.style.color = "black"
            productNameError.style.display = "none"                    
        })
    }

    


    const productDescriptionError = document.querySelector('.description-error')
    if(productDescription.value == ''){
        productDescription.style.border = "1px solid red"
        productDescriptionError.innerHTML = "Please enter product description"
        productDescriptionError.style.color = "red"
        productDescriptionError.style.display = "block"
        productDescriptionError.style.padding = "5px"

        productDescription.addEventListener('input', ()=>{
            productDescription.style.border = ".5px solid black"
            productDescriptionError.innerHTML = ""
            productDescriptionError.style.color = "black"
            productDescriptionError.style.display = "none"                    
        })
    }

    const productPriceError = document.querySelector('.price-error')
    if(productPrice.value == ''){
        productPrice.style.border = "1px solid red"
        productPriceError.innerHTML = "Please enter product price"
        productPriceError.style.color = "red"
        productPriceError.style.display = "block"
        productPriceError.style.padding = "5px"

        productPrice.addEventListener('input', ()=>{
            productPrice.style.border = ".5px solid black"
            productPriceError.innerHTML = ""
            productPriceError.style.color = "black"
            productNameError.style.display = "none"                    
        })
    }

    const productQuantityError = document.querySelector('.quantity-error')
    if(productQuantity.value == ''){
        productQuantity.style.border = "1px solid red"
        productQuantityError.innerHTML = "Please enter product quantity"
        productQuantityError.style.color = "red"
        productQuantityError.style.display = "block"
        productQuantityError.style.padding = "5px"

        productQuantity.addEventListener('input', ()=>{
            productQuantity.style.border = ".5px solid black"
            productQuantityError.innerHTML = ""
            productQuantityError.style.color = "black"
            productQuantityError.style.display = "none"                    
        })
    }

    const productUrlError = document.querySelector('.picture-error')
    if(productUrl.value == ''){
        productUrl.style.border = "1px solid red"
        productUrlError.innerHTML = "Please select a produuct image"
        productUrlError.style.color = "red"
        productUrlError.style.display = "block"
        productUrlError.style.padding = "5px"

        productUrl.addEventListener('change', (e)=>{
            productUrl.style.border = ".5px solid black"
            productUrlError.innerHTML = ""
            productUrlError.style.color = "black"
            productUrlError.style.display = "none"                    
        })
    }

    if(productName.value && productDescription.value && productPrice.value && productUrlString && category && productQuantity.value){
        axios.post('http://127.0.0.1:8080/api/shopie/v1/products', 
        {
            product_name: productName.value,
            description: productDescription.value,
            price: productPrice.value,
            image: productUrlString,
            category,
            quantity: productQuantity.value
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
              window.location.href = './adminCategoryView.html'
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
