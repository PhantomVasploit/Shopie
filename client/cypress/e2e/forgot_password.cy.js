
describe('forgot password', () => {
    it("it should redirect to product categories for successful login",()=>{
      cy.visit('http://localhost:5500/client/auth/html/forgotPassword.html')
      cy.get('#email').type('ignit3graphics@gmail.com');
      
      cy.get('#btn').click();
  
      cy.url().should('include', '/client/auth/html/resetToken.html');
  
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
  