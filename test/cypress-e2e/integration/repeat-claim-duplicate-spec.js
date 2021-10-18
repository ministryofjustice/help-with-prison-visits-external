/// <reference types="cypress" />

const dateFormatter = require('../../../app/services/date-formatter')

const todaysDate = dateFormatter.now()

describe('Repeat claim duplicate claim', () => {
  const caseworker = 'test-e2e@example.com'
  let reference

  before(() => {
    cy.task('insertEligibilityAndClaim').then((generatedRef) => {
      reference = generatedRef
      cy.log(`Claim generated with reference ${reference}`)
    })
  })

  it('should display each page in the repeat claim flow', () => {
    cy.visit(`/assisted-digital?caseworker=${caseworker}`)
    cy.location('pathname').should('equal', '/start')
    cy.getCookie('apvs-assisted-digital')
      .should('have.property', 'value', encodeURIComponent(caseworker))

    // Start ("yes" previous claim made)
    cy.get('[data-cy=yes]').check()
    cy.get('[data-cy=submit]').contains('Continue').click()

    // Start already registered
    cy.get('[data-cy=reference]').type(reference)
    // test values inserted in DB by test/helpers/data/internal/internal-visitor-helper.js
    cy.get('[data-cy=dob-day]').type('22')
    cy.get('[data-cy=dob-month]').type('11')
    cy.get('[data-cy=dob-year]').type('1975')
    cy.get('[data-cy=submit]').contains('Continue').click()

    // Your Claims - start a new claim
    cy.get('[data-cy=new-claim]').click()

    // Check your information
    cy.get('[data-cy=confirm-correct]').check()
    cy.get('[data-cy=submit]').contains('Continue').click()

    // Future or past visit
    cy.get('[data-cy=past]').check()
    cy.get('[data-cy=submit]').contains('Continue').click()

    // Same journey as your last claim
    cy.get('[data-cy=yes]').check()
    cy.get('[data-cy=submit]').contains('Continue').click()

    // Journey information
    cy.get('[data-cy=journey-day]').type(todaysDate.date())
    cy.get('[data-cy=journey-month]').type(todaysDate.month() + 1)
    cy.get('[data-cy=journey-year]').type(todaysDate.year())
    cy.get('[data-cy=submit]').contains('Continue').click()

    // Claim summary
    cy.get('[data-cy=add-visit-confirmation]').click()

    // Upload visit confirmation
    cy.get('[data-cy=post]').check()
    cy.get('[data-cy=submit]').contains('Continue').click()

    // Claim summary
    cy.get('[data-cy=add-expense-receipt]').click()

    // Upload Receipt Bus Adult
    cy.get('[data-cy=post]').check()
    cy.get('[data-cy=submit]').contains('Continue').click()

    // Claim summary
    cy.get('[data-cy=submit]').contains('Continue').click()

    // Enter Bank Account Details
    cy.get('[data-cy=name-on-account]').type('Mr Joe Bloggs')
    cy.get('[data-cy=sort-code]').type('001122')
    cy.get('[data-cy=account-number]').type('00123456')
    cy.get('[data-cy=submit]').contains('Continue').click()

    // Declaration page
    cy.get('[data-cy=terms-and-conditions]').click()
    cy.get('[data-cy=submit]').contains('Finish').click()

    // Application submitted
    cy.contains('Application submitted')
    cy.get('[data-cy=reference]')
      .contains(/^[0123456789ABCDEFGHJKMNPQRSTVWXYZ]{7}$/)
      .contains(reference)
  })

  after(() => {
    cy.task('deleteAllforReference', reference)
  })
})
