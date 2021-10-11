/// <reference types="cypress" />

describe('First Time Claim Flow', () => {

  // The reference will be generated as part of this flow. So capture it once it is generated.
  const caseworker = 'test-e2e@example.com'

  it('should display each page in the first time eligibility flow', () => {

    cy.visit(`/assisted-digital?caseworker=${caseworker}`)
    cy.location('pathname').should('equal', '/start')
    cy.getCookie('apvs-assisted-digital')
      .should('have.property', 'value', encodeURIComponent(caseworker))

    // Start ("no" previous claim made)
    cy.get('[data-cy=no]').check()
    cy.get('[data-cy=submit]').contains('Continue').click()

    // Date of birth
    cy.get('[data-cy=dob-day]').type('1')
    cy.get('[data-cy=dob-month]').type('5')
    cy.get('[data-cy=dob-year]').type('1955')
    cy.get('[data-cy=submit]').contains('Continue').click()

    // Prisoner relationship
    cy.get('[data-cy=partner]').check()
    cy.get('[data-cy=submit]').contains('Continue').click()

    // Benefit
    cy.get('[data-cy=income-support]').check()
    cy.get('[data-cy=yes]').check()
    cy.get('[data-cy=submit]').contains('Continue').click()

    // About the prisoner
    cy.get('[data-cy=prisoner-first-name]').type('Joe')
    cy.get('[data-cy=prisoner-last-name]').type('Bloggs')
    cy.get('[data-cy=dob-day]').type('2')
    cy.get('[data-cy=dob-month]').type('6')
    cy.get('[data-cy=dob-year]').type('1956')
    cy.get('[data-cy=prisoner-number]').type('Z6541TS')
    // test auto-complete for 'Hewell'
    cy.get('input[data-cy=prison-name]').type('Hewe').type('{enter}')
    cy.get('[data-cy=submit]').contains('Continue').click()

  })

})
