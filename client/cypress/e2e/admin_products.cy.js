describe('admin products', () => {
    it("should add a product to the system",()=>{
      cy.visit('http://localhost:5500/client/auth/html/login.html')
      cy.get('#email').type('ignit3graphics@gmail.com');
      cy.get('#password').type('12345678');


  
      cy.get('#submit').click();
      cy.wait(1000);  

      cy.get('[data-cy="view_products"]').click()
      cy.get('[data-cy="add_products"]').click()


      cy.get('#product_name').type('LG Fridge',{force:true});
      cy.get('#product_category').type('Electronics',{force:true});
      cy.get('#product_description').type('LG Fridge brand new',{force:true});
      cy.get('#product_price').type('120000',{force:true});
      cy.get('#product_quantity').type('1000',{force:true});
  
      cy.get('#submitBtn').click();
  
  
    })
  
  
  
  
  //  to do
    it("should reroute to edit products page for edit products",()=>{

    
    cy.visit('http://localhost:5500/client/auth/html/login.html')
    cy.get('#email').type('ignit3graphics@gmail.com');
    cy.get('#password').type('12345678');

    cy.get('#submit').click();
    cy.get('[data-cy="view_products"]').click()

    cy.get('.update-btn-0').click();

    cy.url().should('include', 'client/admin/html/adminEditProduct.html');
    })
  })
  