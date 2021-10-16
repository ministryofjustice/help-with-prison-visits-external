/// <reference types="cypress" />

const dateFormatter = require('../../../app/services/date-formatter')

const todaysDate = dateFormatter.now()

describe('First Time Claim Flow (Northern Ireland rules)', () => {
  // The reference will be generated as part of this flow. So capture it once it is generated.
  const caseworker = 'test-e2e@example.com'

  it('should display each page in the first time eligibility flow for NI rules', () => {
    cy.visit(`/assisted-digital?caseworker=${caseworker}`)
    cy.location('pathname').should('equal', '/start')
    cy.getCookie('apvs-assisted-digital')
      .should('have.property', 'value', encodeURIComponent(caseworker))

    // Start ("no" previous claim made)
    cy.get('[data-cy=no]').check()
    cy.get('[data-cy=submit]').contains('Continue').click()

    // Date of birth
    cy.get('[data-cy=dob-day]').type('3')
    cy.get('[data-cy=dob-month]').type('7')
    cy.get('[data-cy=dob-year]').type('1965')
    cy.get('[data-cy=submit]').contains('Continue').click()

    // Prisoner relationship
    cy.get('[data-cy=partner]').check()
    cy.get('[data-cy=submit]').contains('Continue').click()

    // Benefit
    cy.get('[data-cy=income-support]').check()
    cy.get('[data-cy=yes]').check()
    cy.get('[data-cy=submit]').contains('Continue').click()

    // About the prisoner
    cy.get('[data-cy=prisoner-first-name]').type('Martin')
    cy.get('[data-cy=prisoner-last-name]').type('O\'Hara')
    cy.get('[data-cy=dob-day]').type('4')
    cy.get('[data-cy=dob-month]').type('9')
    cy.get('[data-cy=dob-year]').type('1959')
    cy.get('[data-cy=prisoner-number]').type('Z6544TS')
    // test auto-complete for 'Maghaberry'
    cy.get('input[data-cy=prison-name]').type('Maghab').type('{enter}')
      .should('have.value', 'Maghaberry')
    cy.get('[data-cy=submit]').contains('Continue').click()

    // About you
    cy.get('[data-cy=first-name]').type('Mary')
    cy.get('[data-cy=last-name]').type('O\'Hara')
    cy.get('[data-cy=ni-number]').type('TS876544T')
    cy.get('[data-cy=house-num-and-street]').type('26 NI Street')
    cy.get('[data-cy=town]').type('NI Testtown')
    cy.get('[data-cy=county]').type('NI Testshire')
    cy.get('[data-cy=postcode]').type('NI2 3CD')
    cy.get('[data-cy=country]').select('Northern Ireland')
      .should('have.value', 'Northern Ireland')
    cy.get('[data-cy=email]').type('test-visitor-ni@example.com')
    cy.get('[data-cy=phone]').type('01234 98765')
    cy.get('[data-cy=submit]').contains('Continue').click()

    // Journey information - NI claims skip Future or past visit
    cy.get('[data-cy=journey-day]').type(todaysDate.date())
    cy.get('[data-cy=journey-month]').type(todaysDate.month() + 1)
    cy.get('[data-cy=journey-year]').type(todaysDate.year())
    cy.get('[data-cy=submit]').contains('Continue').click()

    // Has escort
    cy.get('[data-cy=escort-no]').check()
    cy.get('[data-cy=submit]').contains('Continue').click()

    // Has child
    cy.get('[data-cy=child-no]').check()
    cy.get('[data-cy=submit]').contains('Continue').click()

    // Expense
    cy.get('[data-cy=car-only]').click()
    cy.get('[data-cy=submit]').contains('Continue').click()

    // Car
    cy.get('[data-cy=submit]').contains('Continue').click()

    // Claim summary
    cy.get('[data-cy=add-visit-confirmation]').click()

    // Upload visit confirmation
    cy.get('[data-cy=post]').check()
    cy.get('[data-cy=submit]').contains('Continue').click()

    // Claim summary
    cy.get('[data-cy=submit]').contains('Continue').click()

    // Enter Bank Account Details
    cy.get('[data-cy=name-on-account]').type('Mrs Mary O\'Hara')
    cy.get('[data-cy=sort-code]').type('334455')
    cy.get('[data-cy=account-number]').type('65432100')
    cy.get('[data-cy=submit]').contains('Continue').click()

    // Declaration page
    cy.get('[data-cy=terms-and-conditions]').click()
    cy.get('[data-cy=submit]').contains('Finish').click()

    // Application submitted
    cy.contains('Application submitted')
    cy.get('[data-cy=reference]').contains(/^[0-9A-Z]{7}$/)
  })

  after(() => {
    cy.task('deleteRecordsforADCaseworker', caseworker)
  })
})
