
describe('admin login', () => {
    it("it should redirect to admin pages for successful login for admin",()=>{
      cy.visit('http://localhost:5500/client/auth/html/login.html')
      cy.get('#email').type('ignit3graphics@gmail.com');
      cy.get('#password').type('12345678');
  
      cy.get('#submit').click();
  
      cy.url().should('include', 'client/admin/html/customerListView.html');
      
      
    })
  })
  