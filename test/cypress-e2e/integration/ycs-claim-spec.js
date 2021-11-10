/// <reference types="cypress" />

// Some options for YCS claims should only be
// available via the assisted digital route

const dateFormatter = require('../../../app/services/date-formatter')

const todaysDate = dateFormatter.now()

describe('YCS Claim Flow', () => {
  const caseworker = 'test-e2e@example.com'

  it('should NOT display YCS establishments and benefit for standard flow', () => {
    cy.visit('/start')

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

    // Benefit - check no YCS; choose income support
    cy.get('[data-cy=ycs]').should('not.exist')
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
    // test auto-complete for 'Rainsbrook STC (YCS)' - shouldn't exist
    cy.get('input[data-cy=prison-name]').type('Rain').type('{enter}')
      .should('not.have.value', 'Rainsbrook STC (YCS)')
      .clear()
    // test auto-complete for 'Hewell'
    cy.get('input[data-cy=prison-name]').type('Hewe').type('{enter}')
      .should('have.value', 'Hewell')
  })

  it('should display YCS establishments and benefit option for assisted digital flow', () => {
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

    // Benefit - choose YCS
    cy.get('[data-cy=ycs]').check()
    cy.get('[data-cy=yes]').check()
    cy.get('[data-cy=submit]').contains('Continue').click()

    // About the prisoner
    cy.get('[data-cy=prisoner-first-name]').type('Joe')
    cy.get('[data-cy=prisoner-last-name]').type('Bloggs')
    cy.get('[data-cy=dob-day]').type('2')
    cy.get('[data-cy=dob-month]').type('6')
    cy.get('[data-cy=dob-year]').type('1956')
    cy.get('[data-cy=prisoner-number]').type('Z6541TS')
    // test auto-complete for 'Rainsbrook STC (YCS)'
    cy.get('input[data-cy=prison-name]').type('Rain').type('{enter}')
      .should('have.value', 'Rainsbrook STC (YCS)')
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
    cy.get('[data-cy=past]').check()
    cy.get('[data-cy=submit]').contains('Continue').click()

    // Journey information
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
    cy.get('[data-cy=car]').click()
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
    cy.get('[data-cy=name-on-account]').type('Mr Joe Bloggs')
    cy.get('[data-cy=sort-code]').type('001122')
    cy.get('[data-cy=account-number]').type('00123456')
    cy.get('[data-cy=submit]').contains('Continue').click()

    // Declaration page
    cy.get('[data-cy=terms-and-conditions]').click()
    cy.get('[data-cy=submit]').contains('Finish').click()

    // Application submitted
    cy.contains('Application submitted')
    cy.get('[data-cy=reference]').contains(/^[0123456789ABCDEFGHJKMNPQRSTVWXYZ]{7}$/)
  })

  after(() => {
    cy.task('deleteRecordsforADCaseworker', caseworker)
  })
})
