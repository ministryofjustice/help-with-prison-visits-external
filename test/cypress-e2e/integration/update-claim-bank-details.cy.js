/// <reference types="cypress" />

describe('Claim payment information requested', () => {
  const caseworker = 'test-e2e@example.com'
  let reference

  before(() => {
    cy.task('insertEligibilityAndClaim', 'REQUEST-INFO-PAYMENT').then(generatedRef => {
      reference = generatedRef
      cy.log(`Claim generated with reference ${reference}`)
    })
  })

  it('should display update bank details', () => {
    cy.visit(`/assisted-digital?caseworker=${caseworker}`)
    cy.location('pathname').should('equal', '/start')
    cy.getCookie('apvs-assisted-digital').should('have.property', 'value', encodeURIComponent(caseworker))

    // Start ("yes" previous claim made)
    cy.get('[data-cy="yes"]').check()
    cy.get('[data-cy="submit"]').contains('Continue').click()

    // Start already registered
    cy.get('[data-cy="reference"]').type(reference)
    // test values inserted in DB by test/helpers/data/internal/internal-visitor-helper.js
    cy.get('[data-cy="dob-day"]').type('22')
    cy.get('[data-cy="dob-month"]').type('11')
    cy.get('[data-cy="dob-year"]').type('1975')
    cy.get('[data-cy="submit"]').contains('Continue').click()

    // Your Claims
    cy.get('[data-cy="add-info"]').click()

    // Click to add visit confirmation
    cy.get('[data-cy="update-visit-confirmation"]').click()

    // Post Later visit confirmation
    cy.get('[data-cy="post"]').check()
    cy.get('[data-cy="submit"]').contains('Continue').click()

    // Add message to claim and submit
    cy.get('[data-cy="name-on-account"]').type('Mr Joe Bloggs')
    cy.get('[data-cy="sort-code"]').type('223344')
    cy.get('[data-cy="account-number"]').type('11223344')
    cy.get('[data-cy="message-to-caseworker"]').type(
      'Sorry about that, my bank account information has been corrected.',
    )
    cy.get('[data-cy="submit"]').contains('Submit updates').click()

    // Updated view claims page
    cy.contains('Application updated')
  })

  after(() => {
    cy.task('deleteAllforReference', reference)
  })
})
