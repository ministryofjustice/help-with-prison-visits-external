/// <reference types="cypress" />

const dateFormatter = require('../../../app/services/date-formatter')

const futureDate = dateFormatter.now().add(14, 'days')

describe('First Time Claim Flow', () => {
  // The reference will be generated as part of this flow. So capture it once it is generated.
  const caseworker = 'test-e2e@example.com'

  it('should display each page in the first time eligibility flow Advance', () => {
    cy.visit(`/assisted-digital?caseworker=${caseworker}`)
    cy.location('pathname').should('equal', '/start')
    cy.getCookie('apvs-assisted-digital')
      .should('have.property', 'value', encodeURIComponent(caseworker))

    // Start ("no" previous claim made)
    cy.get('[data-cy=no]').check()
    cy.get('[data-cy=submit]').contains('Continue').click()

    // Date of birth
    cy.get('[data-cy=dob-day]').type('10')
    cy.get('[data-cy=dob-month]').type('11')
    cy.get('[data-cy=dob-year]').type('1969')
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
    cy.get('[data-cy=dob-day]').type('3')
    cy.get('[data-cy=dob-month]').type('7')
    cy.get('[data-cy=dob-year]').type('1957')
    cy.get('[data-cy=prisoner-number]').type('Z6541TS')
    // test auto-complete for 'Hewell'
    cy.get('input[data-cy=prison-name]').type('Hewe').type('{enter}')
      .should('have.value', 'Hewell')
    cy.get('[data-cy=submit]').contains('Continue').click()

    // About you
    cy.get('[data-cy=first-name]').type('John')
    cy.get('[data-cy=last-name]').type('Smith')
    cy.get('[data-cy=ni-number]').type('TS876541T')
    cy.get('[data-cy=house-num-and-street]').type('123 The Street')
    cy.get('[data-cy=town]').type('New Testtown')
    cy.get('[data-cy=county]').type('Testshire')
    cy.get('[data-cy=postcode]').type('T1 2AB')
    cy.get('[data-cy=country]').select('England')
      .should('have.value', 'England')
    cy.get('[data-cy=email]').type('test-visitor@example.com')
    cy.get('[data-cy=phone]').type('01234 567789')
    cy.get('[data-cy=submit]').contains('Continue').click()

    // Future or past visit
    cy.get('[data-cy=advance]').check()
    cy.get('[data-cy=submit]').contains('Continue').click()

    // Journey information
    cy.get('[data-cy=journey-day]').type(futureDate.date())
    cy.get('[data-cy=journey-month]').type(futureDate.month() + 1)
    cy.get('[data-cy=journey-year]').type(futureDate.year())
    cy.get('[data-cy=submit]').contains('Continue').click()

    // Has escort
    cy.get('[data-cy=escort-no]').check()
    cy.get('[data-cy=submit]').contains('Continue').click()

    // Has child
    cy.get('[data-cy=child-no]').check()
    cy.get('[data-cy=submit]').contains('Continue').click()

    // Expense
    cy.get('[data-cy=train]').click()
    cy.get('[data-cy=submit]').contains('Continue').click()

    // Train - With departure time rather than cost field.
    cy.get('[data-cy=from]').type('Euston')
    cy.get('[data-cy=to]').type('Birmingham New Street')
    cy.get('[data-cy=return-yes]').click()
    cy.get('[data-cy=departure-time]').type('10am')
    cy.get('[data-cy=return-time]').type('4pm')
    cy.get('[data-cy=submit]').contains('Continue').click()

    // Claim summary (advance claims do not need visit confirmation/expense upload)
    cy.get('[data-cy=submit').click()

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
    cy.get('[data-cy=reference]').contains(/^[0-9A-Z]{7}$/)
  })

  after(() => {
    cy.task('deleteRecordsforADCaseworker', caseworker)
  })
})
