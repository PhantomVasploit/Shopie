

  describe('user login', () => {
    it("it should redirect to product categories for successful login",()=>{
      cy.visit('http://localhost:5500/client/auth/html/login.html')
      cy.get('#email').type('paulsanga@gmail.com');
      cy.get('#password').type('12345678');
  
      cy.get('#submit').click();
  
      cy.url().should('include', '/client/customer/html/productCategories.html');
      
      
    })
  })