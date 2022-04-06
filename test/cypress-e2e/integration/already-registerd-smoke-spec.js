/// <reference types="cypress" />

describe('Smoke test', () => {
  const REFERENCE = 'AAAAAAA'

  it('should display already registered page and check database for non-existent reference', () => {
    // Start already registered
    cy.visit('/start-already-registered').contains('Return visitors')

    cy.get('[data-cy="reference"]').type(REFERENCE)
    cy.get('[data-cy="dob-day"]').type('13')
    cy.get('[data-cy="dob-month"]').type('1')
    cy.get('[data-cy="dob-year"]').type('1980')

    cy.get('[data-cy="submit"]').contains('Continue').click()

    cy.title().should('eq', 'Error: Return visitor sign in - Get help with the cost of prison visits')
    cy.contains('Could not find any claims for these details')
  })
})
