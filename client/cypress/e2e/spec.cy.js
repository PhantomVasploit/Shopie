describe('customer use', () => {
  it("view specific category",()=>{
    cy.visit('http://localhost:5500/client/auth/html/login.html')
    cy.get('#email').type('paulsanga@gmail.com');
      cy.get('#password').type('12345678');
    cy.get('#submit').click();

    cy.wait(1000)
    cy.get('#first-product').click({ force: true });

    // to do

    
    cy.url().should('include', 'client/customer/html/productCategories.html');
  })

  // it("should add item to cart",()=>{
  //   { multiple: true }
  //   cy.visit('http://localhost:5500/client/auth/html/login.html')
  //   cy.get('#email').type('paulsanga@gmail.com');
  //   cy.get('#password').type('12345678');
  //   cy.get('#submit').click();

    
  //   cy.visit('http://localhost:5500/client/customer/html/products.html?category=electronics')
  //   cy.get('.btn').click();

  //   cy.get('.toastify', { timeout: 10000 }) 
  //     .should('be.visible')
  //     .contains('Item added to cart');

  // })
  // it("should add item to cart", () => {
  //   cy.visit('http://localhost:5500/client/auth/html/login.html');
  //   cy.get('#email').type('paulsanga@gmail.com');
  //   cy.get('#password').type('12345678');
  //   cy.get('#submit').click();
  
  //   cy.url().should('include', 'client/customer/html/productCategories.html');
  
  //   cy.visit('http://localhost:5500/client/customer/html/products.html?category=electronics');
  
  //   cy.url().should('include', '/client/customer/html/products.html');
  
  //   const addtocart = cy.get(".btn").eq(1).should("contain.text", "Add to cart");
  
  //   addtocart.click();
  
  //   cy.get('.toastify', { timeout: 10000 })
  //     .should('be.visible')
  //     .contains('Item added to cart');
  // });
  

  
})

// describe('cart checkout', () => {
  
//   it("should checkout",()=>{
//     cy.visit('http://localhost:5500/client/auth/html/login.html')
//     cy.get('#email').type('paulsanga@gmail.com');
//     cy.get('#password').type('12345678');

//     cy.get('#submit').click();
    
//     cy.visit('http://localhost:5500/client/customer/html/viewCart.html')
  
//     cy.get('#check-out').click();

//     cy.url().should('include', 'client/customer/html/productCategories.html');

//   }) 
// })


