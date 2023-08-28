describe('user registration', () => {
  it('returns User registered successfully on successfull registration', () => {
    cy.visit('http://localhost:5500/client/auth/html/register.html')

    cy.get('#first-name').type('John Doe');
    cy.get('#last-name').type('John Doe');
    cy.get('#email').type('benard.siloma@gmail.com');
    cy.get('#phone-number').type('0701020304');
    cy.get('#password').type('12345678');

    cy.get('#submit').click();

    cy.get(".profile-picture-error").contains("Please select a profile picture")

    
  })

  // it('returns fill all field incase a field iis not filled', () => {
  //   cy.visit('http://localhost:5500/register.html')

    
  //   cy.get('#cohort_number').type('17');
  //   cy.get('#email').type('benard1.siloma@gmail.com');
  //   cy.get('#password').type('12345678');
  //   cy.get('#password2').type('12345678');

  //   cy.get('#submit').click();

  //   cy.get("#notifications-reg").contains("fill all fields")


  // })


  // it('returns registration failed incase of using email which is already in database', () => {
  //   cy.visit('http://localhost:5500/register.html')

    
  //   cy.get('#full-name').type('John Doe');
  //   cy.get('#cohort_number').type('17');
  //   cy.get('#email').type('benard.siloma@gmail.com');
  //   cy.get('#password').type('12345678');
  //   cy.get('#password2').type('12345678');

  //   cy.get('#submit').click();

  //   cy.get("#notifications-reg").contains("User registration failed")


  // })

})




describe('user login', () => {
  it("it should redirect to product categories for successful login",()=>{
    cy.visit('http://localhost:5500/client/auth/html/login.html')
    cy.get('#email').type('ignit3graphics@gmail.com');
    cy.get('#password').type('12345678');

    cy.get('#submit').click();

    cy.url().should('include', '/client/customer/html/productCategories.html');
    
    
  })
})


describe('forgot password', () => {
  it("it should redirect to product categories for successful login",()=>{
    cy.visit('http://localhost:5500/client/auth/html/forgotPassword.html')
    cy.get('#email').type('ignit3graphics@gmail.com');
    
    cy.get('#btn').click();

    cy.url().should('include', '/client/auth/html/resetToken.html?email=ignit3graphics@gmail.com');

  })

  it("it should show toastify with error if email is not registered",()=>{
    cy.visit('http://localhost:5500/client/auth/html/forgotPassword.html')
    cy.get('#email').type('ignaphics@gmail.com');
    
    cy.get('#btn').click();

    cy.get('.toastify', { timeout: 10000 }) 
      .should('be.visible')
      .contains('Email is not registered');

  })
})


describe('user login', () => {
  it("it should redirect to product categories for successful login",()=>{
    cy.visit('http://localhost:5500/client/auth/html/login.html')
    cy.get('#email').type('ignit3graphics@gmail.com');
    cy.get('#password').type('12345678');

    cy.get('#submit').click();

    cy.url().should('include', '/client/customer/html/productCategories.html');
    cy.get('.toastify', { timeout: 10000 }) 
    .should('be.visible')
    .contains('Login successful');
    
  })
})


describe('deactivate account and reactivate an account', () => {
  it("it should redirect to login for successful deactivation",()=>{
    cy.visit('http://localhost:5500/client/auth/html/login.html')
    cy.get('#email').type('ignit3graphics@gmail.com');
    cy.get('#password').type('12345678');

    cy.get('#submit').click();
    cy.visit('http://localhost:5500/client/customer/html/deactivateAccount.html')
    cy.get('#password').type('12345678');
    cy.get('#deact-btn').click();
    cy.url().should('include', '/client/auth/html/login.html');

  })
  
  it("it should redirect to login for successful activation",()=>{
    cy.visit('http://localhost:5500/client/customer/html/reactivateAccount.html?email=ignit3graphics@gmail.com')
    cy.get('#password').type('12345678');
    
    cy.get('#act-btn').click();

    cy.url().should('include', '/client/auth/html/login.html');

  })
  
  it("it should show toastify with error if email is not registered",()=>{
    cy.visit('http://localhost:5500/client/customer/html/reactivateAccount.html?email=ignit3graph@gmail.com')
    cy.get('#password').type('12345678');
    
    cy.get('#act-btn').click();

    cy.get('.toastify', { timeout: 10000 }) 
      .should('be.visible')
      .contains('Customer account not found');

  })
})


describe('admin products', () => {
  it("should add a product to the system",()=>{
    cy.visit('http://localhost:5500/client/admin/html/addNewProduct.html')
    cy.get('#product_name').type('LG Fridge');
    cy.get('#product_category').type('Electronics');
    cy.get('#product_description').type('LG Fridge brand new');
    cy.get('#product_price').type('120000');
    cy.get('#product_quantity').type('1000');

    cy.get('#submitBtn').click();


  })

  it("should reroute to edit roducts page",()=>{
    cy.visit('http://localhost:5500/client/admin/html/adminProductsView.html')

    cy.get('#delete-btn').click();

    cy.url().should('include', 'client/admin/html/adminEditProduct.html');
  })
})

describe('customer use', () => {
  it("should add item to cart",()=>{
  
    cy.get('#addtocart').click();

    cy.get('.toastify', { timeout: 10000 }) 
      .should('be.visible')
      .contains('Item added to cart');

  })

  
})

describe('customer use', () => {
  it("should add item to cart",()=>{
    cy.visit('http://localhost:5500/client/admin/html/adminProductsView.html')
  
    cy.get('#addtocart').click();

    cy.get('.toastify', { timeout: 10000 }) 
      .should('be.visible')
      .contains('Item added to cart');

  })
  it("should checkout",()=>{
    cy.visit('http://localhost:5500/client/customer/html/viewCart.html')
  
    cy.get('#check-out').click();

    cy.url().should('include', 'client/admin/html/adminEditProduct.html');

  }) 
})