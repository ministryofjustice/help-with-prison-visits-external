/// <reference types="cypress" />

describe('First Time Claim Flow (Northern Ireland rules)', () => {
  // The reference will be generated as part of this flow. So capture it once it is generated.
  const caseworker = 'test-e2e@example.com'

  it('should display each page in the first time eligibility flow for NI rules', () => {
    cy.visit(`/assisted-digital?caseworker=${caseworker}`)
    cy.location('pathname').should('equal', '/start')
    cy.getCookie('apvs-assisted-digital').should('have.property', 'value', encodeURIComponent(caseworker))

    // Start ("no" previous claim made)
    cy.get('[data-cy="no"]').check()
    cy.get('[data-cy="submit"]').contains('Continue').click()

    // Date of birth
    cy.get('[data-cy="dob-day"]').type('3')
    cy.get('[data-cy="dob-month"]').type('7')
    cy.get('[data-cy="dob-year"]').type('1965')
    cy.get('[data-cy="submit"]').contains('Continue').click()

    // Prisoner relationship
    cy.get('[data-cy="partner"]').check()
    cy.get('[data-cy="submit"]').contains('Continue').click()

    // Benefit
    cy.get('[data-cy="income-support"]').check()
    cy.get('[data-cy="yes"]').check()
    cy.get('[data-cy="submit"]').contains('Continue').click()

    // About the prisoner
    cy.get('[data-cy="prisoner-first-name"]').type('Martin')
    cy.get('[data-cy="prisoner-last-name"]').type("O'Hara")
    cy.get('[data-cy="dob-day"]').type('4')
    cy.get('[data-cy="dob-month"]').type('9')
    cy.get('[data-cy="dob-year"]').type('1959')
    cy.get('[data-cy="prisoner-number"]').type('Z6544TS')
    // test auto-complete for 'Maghaberry'
    cy.get('input[data-cy="prison-name"]').type('Maghab').type('{enter}').should('have.value', 'Maghaberry')
    cy.get('[data-cy="submit"]').contains('Continue').click()

    // About you
    cy.get('[data-cy="first-name"]').type('Mary')
    cy.get('[data-cy="last-name"]').type("O'Hara")
    cy.get('[data-cy="ni-number"]').type('TS876544T')
    cy.get('[data-cy="house-num-and-street"]').type('26 NI Street')
    cy.get('[data-cy="town"]').type('NI Testtown')
    cy.get('[data-cy="county"]').type('NI Testshire')
    cy.get('[data-cy="postcode"]').type('BT1 3CD')
    cy.get('[data-cy="country"]').select('Northern Ireland').should('have.value', 'Northern Ireland')
    cy.get('[data-cy="email"]').type('test-visitor-ni@example.com')
    cy.get('[data-cy="phone"]').type('01234 98765')
    cy.get('[data-cy="submit"]').contains('Continue').click()

    // NI claim - journey should finish with the NI Claimants info page
    cy.location('pathname').should('equal', '/apply/first-time/new-eligibility/about-you')
    cy.get('h1.govuk-heading-l').contains('Northern Ireland claimants')
  })
})
