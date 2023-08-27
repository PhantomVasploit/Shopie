describe('user registration', () => {
  it('returns User registered successfully on successfull registration', () => {
    cy.visit('http://localhost:5500/client/auth/html/register.html')

    cy.get('#first-name').type('John Doe');
    cy.get('#last-name').type('John Doe');
    cy.get('#email').type('benard.siloma@gmail.com');
    cy.get('#phone-number').type('0701020304');
    cy.get('#password').type('12345678');

    // cy.fixture('../../static/img/shopie.jpg').then(fileContent => {
    //   cy.get('#profile-picture').attachFile({
    //     fileContent: fileContent,
    //     fileName: 'shopie.jpg',
    //     mimeType: 'image/jpeg'
    //   });
    // });

    cy.get('#submit').click();

    cy.get(".profile-picture-error").contains("Please select a profile picture")

    // cy.get('.toast-notification', { timeout: 10000 }) // Adjust timeout as needed
    //   .should('be.visible')
    //   .contains('User registered successfully');
  
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

    cy.get('.toastify', { timeout: 10000 }) // Adjust timeout as needed
      .should('be.visible')
      .contains('Email is not registered');

  })
})