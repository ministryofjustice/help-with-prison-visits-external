/// <reference types="cypress" />

describe('Upload later and send a message', () => {
  const caseworker = 'test-e2e@example.com'
  let reference

  before(() => {
    cy.task('insertEligibilityAndClaim', 'PENDING').then((generatedRef) => {
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

    // Your Claims
    cy.get('[data-cy=add-info]').click()

    // Click to add visit confirmation
    cy.get('[data-cy=update-visit-confirmation]').click()

    // Post Later visit confirmation
    cy.get('[data-cy=post]').check()
    cy.get('[data-cy=submit]').contains('Continue').click()

    // Add message to claim and submit
    cy.get('[data-cy=message-to-caseworker]')
      .type('Sorry I have lost my bus receipt, is it ok to still approve my ' +
        'claim? I will post the other as soon as I can.')
    cy.get('[data-cy=submit]').contains('Submit updates').click()

    // Updated view claims page
    cy.contains('Application updated')
  })

  after(() => {
    cy.task('deleteAllforReference', reference)
  })
})
