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
    cy.get('[data-cy=name').contains('Fred S****')
    cy.get('[data-cy=address').contains('123*******, Belfast, ****7RT')
    cy.get('[data-cy=benefit').contains('Income Support')
    cy.get('[data-cy=relationship').contains('Partner')
    cy.get('[data-cy=prisoner-name').contains('John S****')
    cy.get('[data-cy=prisoner-number').contains('0123456789')
    cy.get('[data-cy=prison').contains('Hewell')
    cy.get('[data-cy=email').contains('donotsend@apvs.com')
    cy.get('[data-cy=phone').contains('******5564')
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
    cy.get('[data-cy=visitor]').contains('Fred S****')
    cy.get('[data-cy=child-1]').contains('Joe B*****')
    cy.get('[data-cy=benefits]').contains('Income Support')
    cy.get('[data-cy="prisoner-name"]').contains('John S****')
    cy.get('[data-cy="prisoner-number"]').contains('0123456789')
    cy.get('[data-cy="prison"]').contains('Hewell')
    cy.get('[data-cy="visit-date"]').contains(todaysDate.format('dddd D MMMM YYYY'))
    cy.get('[data-cy="visit-confirmation"]').contains('Sending visit confirmation by post')
    cy.get('[data-cy="expense-1"]')
      .should('contain', 'Bus')
      .and('contain', 'You - London to Edinburgh - Return')
    cy.get('[data-cy="expense-amount-1"]').contains('£10')
    cy.get('[data-cy="expense-info-1"]').contains('Receipt needed')
    cy.get('[data-cy=add-expense-receipt]').click()

    // Upload Receipt Bus Adult
    cy.get('[data-cy=post]').check()
    cy.get('[data-cy=submit]').contains('Continue').click()

    // Claim summary
    cy.get('[data-cy="expense-1"]')
      .should('contain', 'Bus')
      .and('contain', 'You - London to Edinburgh - Return')
    cy.get('[data-cy="expense-amount-1"]').contains('£10')
    cy.get('[data-cy="expense-info-1"]').contains('Sending receipt by post')
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
