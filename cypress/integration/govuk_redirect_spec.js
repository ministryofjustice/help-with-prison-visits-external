/// <reference types="cypress" />

describe('GOV.UK redirect', () => {
  it('should redirect / to gov.uk site', () => {
    cy.visit('/') // change URL to match your dev URL

    cy.location('href').should('equal', 'https://www.gov.uk/help-with-prison-visits')
  })
})