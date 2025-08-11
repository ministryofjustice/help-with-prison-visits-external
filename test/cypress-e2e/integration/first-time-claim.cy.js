/// <reference types="cypress" />

const dateFormatter = require('../../../app/services/date-formatter')

const todaysDate = dateFormatter.now()

describe('First Time Claim Flow', () => {
  // The reference will be generated as part of this flow. So capture it once it is generated.
  const caseworker = 'test-e2e@example.com'

  it('should display each page in the first time eligibility flow', () => {
    cy.visit(`/assisted-digital?caseworker=${caseworker}`)
    cy.location('pathname').should('equal', '/start')
    cy.getCookie('apvs-assisted-digital').should('have.property', 'value', encodeURIComponent(caseworker))

    // Start ("no" previous claim made)
    cy.get('[data-cy="no"]').check()
    cy.get('[data-cy="submit"]').contains('Continue').click()

    // Date of birth
    cy.get('[data-cy="dob-day"]').type('1')
    cy.get('[data-cy="dob-month"]').type('5')
    cy.get('[data-cy="dob-year"]').type('1955')
    cy.get('[data-cy="submit"]').contains('Continue').click()

    // Prisoner relationship
    cy.get('[data-cy="partner"]').check()
    cy.get('[data-cy="submit"]').contains('Continue').click()

    // Benefit
    cy.get('[data-cy="income-support"]').check()
    cy.get('[data-cy="yes"]').check()
    cy.get('[data-cy="submit"]').contains('Continue').click()

    // About the prisoner
    cy.get('[data-cy="prisoner-first-name"]').type('Joe')
    cy.get('[data-cy="prisoner-last-name"]').type('Bloggs')
    cy.get('[data-cy="dob-day"]').type('2')
    cy.get('[data-cy="dob-month"]').type('6')
    cy.get('[data-cy="dob-year"]').type('1956')
    cy.get('[data-cy="prisoner-number"]').type('Z6541TS')
    // test auto-complete for 'Hewell'
    cy.get('input[data-cy="prison-name"]').type('Hewe').type('{enter}').should('have.value', 'Hewell')
    cy.get('[data-cy="submit"]').contains('Continue').click()

    // About you
    cy.get('[data-cy="first-name"]').type('John')
    cy.get('[data-cy="last-name"]').type('Smith')
    cy.get('[data-cy="ni-number"]').type('TS876541T')
    cy.get('[data-cy="house-num-and-street"]').type('123 The Street')
    cy.get('[data-cy="town"]').type('New Testtown')
    cy.get('[data-cy="county"]').type('Testshire')
    cy.get('[data-cy="postcode"]').type('T1 2AB')
    cy.get('[data-cy="country"]').select('England').should('have.value', 'England')
    cy.get('[data-cy="email"]').type('test-visitor@example.com')
    cy.get('[data-cy="phone"]').type('01234 567789')
    cy.get('[data-cy="submit"]').contains('Continue').click()

    // Future or past visit
    cy.get('[data-cy="past"]').check()
    cy.get('[data-cy="submit"]').contains('Continue').click()

    // Journey information
    cy.get('[data-cy="journey-day"]').type(todaysDate.date())
    cy.get('[data-cy="journey-month"]').type(todaysDate.month() + 1)
    cy.get('[data-cy="journey-year"]').type(todaysDate.year())
    cy.get('[data-cy="submit"]').contains('Continue').click()

    // Has escort
    cy.get('[data-cy="escort-yes"]').check()
    cy.get('[data-cy="submit"]').contains('Continue').click()

    // Escort
    cy.get('[data-cy="first-name"]').type('Frank')
    cy.get('[data-cy="last-name"]').type('Jones')
    cy.get('[data-cy="dob-day"]').type('15')
    cy.get('[data-cy="dob-month"]').type('7')
    cy.get('[data-cy="dob-year"]').type('1985')
    cy.get('[data-cy="submit"]').contains('Continue').click()

    // Has child
    cy.get('[data-cy="child-yes"]').check()
    cy.get('[data-cy="submit"]').contains('Continue').click()

    // About Child #1
    cy.get('[data-cy="first-name"]').type('Sam')
    cy.get('[data-cy="last-name"]').type('Bloggs')
    cy.get('[data-cy="dob-day"]').type('16')
    cy.get('[data-cy="dob-month"]').type('5')
    cy.get('[data-cy="dob-year"]').type('2014')
    cy.get('[data-cy="claimants-child"]').check()
    cy.get('[data-cy="add-another-child"]').check()
    cy.get('[data-cy="submit"]').contains('Continue').click()

    // About Child #2
    cy.get('[data-cy="first-name"]').type('Lewis')
    cy.get('[data-cy="last-name"]').type('Bloggs')
    cy.get('[data-cy="dob-day"]').type('20')
    cy.get('[data-cy="dob-month"]').type('12')
    cy.get('[data-cy="dob-year"]').type('2013')
    cy.get('[data-cy="claimants-child"]').check()
    cy.get('[data-cy="submit"]').contains('Continue').click()

    // Expense
    cy.get('[data-cy="car"]').click()
    cy.get('[data-cy="bus"]').click()
    cy.get('[data-cy="refreshment"]').click()
    cy.get('[data-cy="submit"]').contains('Continue').click()

    // Car
    cy.get('[data-cy="submit"]').contains('Continue').click()

    // Bus #1 (adult expense)
    cy.get('[data-cy="is-child-ticket"]').click()
    cy.get('[data-cy="from"]').type('Euston')
    cy.get('[data-cy="to"]').type('Birmingham New Street')
    cy.get('[data-cy="return-no"]').click()
    cy.get('[data-cy="cost"]').type('20')
    cy.get('[data-cy="add-another-journey"]').click()
    cy.get('[data-cy="submit"]').contains('Continue').click()

    // Bus #2 (add another journey) (child expense)
    cy.get('[data-cy="is-escort-ticket"]').click()
    cy.get('[data-cy="from"]').type('Euston')
    cy.get('[data-cy="to"]').type('Birmingham New Street')
    cy.get('[data-cy="return-no"]').click()
    cy.get('[data-cy="cost"]').type('21')
    cy.get('[data-cy="submit"]').contains('Continue').click()

    // Light refreshment
    cy.get('[data-cy="cost"]').type('7.99')
    cy.get('[data-cy="submit"]').contains('Continue').click()

    // Claim summary
    cy.get('[data-cy="add-visit-confirmation"]').click()

    // Upload visit confirmation
    cy.get('[data-cy="post"]').check()
    cy.get('[data-cy="submit"]').contains('Continue').click()

    // TODO Fix document upload (reminder - from wdio tests)

    // Claim summary
    cy.get('[data-cy="add-expense-receipt"]').first().click()

    // Upload Receipt Bus Adult
    cy.get('[data-cy="post"]').check()
    cy.get('[data-cy="submit"]').contains('Continue').click()

    // Claim summary
    cy.get('[data-cy="add-expense-receipt"]').first().click()

    // Upload Receipt Bus Child
    cy.get('[data-cy="post"]').check()
    cy.get('[data-cy="submit"]').contains('Continue').click()

    // Car journey and light refreshment do not require receipts

    // Claim summary
    cy.get('[data-cy="visitor"]').contains('John Smith')
    cy.get('[data-cy="escort"]').contains('Frank Jones')
    cy.get('[data-cy="child-1"]').contains('Lewis Bloggs')
    cy.get('[data-cy="child-2"]').contains('Sam Bloggs')
    cy.get('[data-cy="benefits"]').contains('Income Support')
    cy.get('[data-cy="prisoner-name"]').contains('Joe Bloggs')
    cy.get('[data-cy="prisoner-number"]').contains('Z6541TS')
    cy.get('[data-cy="prison"]').contains('Hewell')
    cy.get('[data-cy="visit-date"]').contains(todaysDate.format('dddd D MMMM YYYY'))
    cy.get('[data-cy="visit-confirmation"]').contains('Sending visit confirmation by post')
    cy.get('[data-cy="expense-1"]').should('contain', 'Car').and('contain', 'New Testtown to Hewell')
    cy.get('[data-cy="expense-amount-1"]').contains(
      '20p per mile for this kind of travel (30p if travelling to a Scottish prison)',
    )
    cy.get('[data-cy="expense-2"]').should('contain', 'Bus').and('contain', 'Child - Euston to Birmingham New Street')
    cy.get('[data-cy="expense-amount-2"]').contains('£20')
    cy.get('[data-cy="expense-info-2"]').contains('Sending receipt by post')
    cy.get('[data-cy="expense-3"]').should('contain', 'Bus').and('contain', 'Escort - Euston to Birmingham New Street')
    cy.get('[data-cy="expense-amount-3"]').contains('£21')
    cy.get('[data-cy="expense-info-3"]').contains('Sending receipt by post')
    cy.get('[data-cy="expense-4"]').contains('Light refreshment')
    cy.get('[data-cy="expense-amount-4"]').contains('£7.99')
    cy.get('[data-cy="submit"]').contains('Continue').click()

    // Enter Bank Account Details
    cy.get('[data-cy="name-on-account"]').type('Mr Joe Bloggs')
    cy.get('[data-cy="sort-code"]').type('001122')
    cy.get('[data-cy="account-number"]').type('00123456')
    cy.get('[data-cy="submit"]').contains('Continue').click()

    // Declaration page
    cy.get('[data-cy="terms-and-conditions"]').click()
    cy.get('[data-cy="submit"]').contains('Finish').click()

    // Application submitted
    cy.contains('Application submitted')
    cy.get('[data-cy="reference"]').contains(/^[0123456789ABCDEFGHJKMNPQRSTVWXYZ]{7}$/)
  })

  after(() => {
    cy.task('deleteRecordsforADCaseworker', caseworker)
  })
})
