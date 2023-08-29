
describe('deactivate account and reactivate an account', () => {
    it("it should redirect to login for successful deactivation",()=>{
      cy.visit('http://localhost:5500/client/auth/html/login.html')
      cy.get('#email').type('paulsanga@gmail.com');
      cy.get('#password').type('12345678');
  
      cy.get('#submit').click();
  
      cy.visit('http://localhost:5500/client/customer/html/deactivateAccount.html')
      cy.get('#password').type('12345678');
      cy.get('#deact-btn').click();
      cy.url().should('include', '/client/auth/html/login.html');
  
    })
    
    it("it show toastify if you activate account",()=>{
      cy.visit('http://localhost:5500/client/customer/html/reactivateAccount.html?email=paulsanga@gmail.com')
      cy.get('#password').type('12345678');
      
      cy.get('#act-btn').click();
  
      
      cy.get('.toastify', { timeout: 10000 }) 
      .should('be.visible')
      .contains('Account is activated');
  
    })
  
    it("it show toastify if you reactivate active account",()=>{
      cy.visit('http://localhost:5500/client/customer/html/reactivateAccount.html?email=ignit3graphics@gmail.com')
      cy.get('#password').type('12345678');
      
      cy.get('#act-btn').click();
  
      
      cy.get('.toastify', { timeout: 10000 }) 
      .should('be.visible')
      .contains('Customer account is already active');
  
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
  