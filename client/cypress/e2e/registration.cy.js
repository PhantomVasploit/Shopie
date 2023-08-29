import 'cypress-file-upload';
describe('user registration', () => {
  it('should ensure user registration input is validated especially the image', () => {
    cy.visit('http://localhost:5500/client/auth/html/register.html')
    cy.get('#first-name').type('John Doe');
    cy.get('#last-name').type('John Doe');
    cy.get('#email').type('benard.siloma@gmail.com');
    cy.get('#phone-number').type('0701020304');
    cy.get('#password').type('12345678');

    cy.get('#submit').click();

    cy.get(".profile-picture-error").contains("Please select a profile picture")

    
  })

  it('returns Email provided is already registered toastify for already registered email', () => {
    cy.visit('http://localhost:5500/client/auth/html/register.html')
    cy.get('#first-name').type('John');
    cy.get('#last-name').type('Doe');
    cy.get('#email').type('johndoe.test@gmail.com');
    cy.get('#phone-number').type('0700000000');
    cy.get('#password').type('12345678');
    cy.get('#profile-picture').attachFile('../../static/img/test_profile.jpg')

    cy.wait(6000);  
    
    cy.get('[data-cy="register_user"]').click({ force: true });
    cy.get('[data-cy="register_user"]').type('{enter}');


    
    cy.get('.toastify', { timeout: 10000 }) 
    .should('be.visible')
    .contains('Email provided is already registered');
    
  })

})