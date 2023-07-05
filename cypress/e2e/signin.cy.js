describe('Signin flow', () => {
  it('Should have h1 tag Onshift', () => {
    cy.visit('/')

    cy.get('h1').contains('Onshift')
  })
})