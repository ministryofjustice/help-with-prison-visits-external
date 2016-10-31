// TODO: Will need to add check on each of the pages that has a constructed URL path.

describe('First time claim flow', () => {
  it('should display each page in the first time eligibility flow', () => {
    return browser.url('/')

      // Index
      .waitForExist('#start')
      .click('#start')

      // Start
      .waitForExist('#first-time-submit')
      .click('#first-time-submit')

      // Date of birth
      .waitForExist('#date-of-birth-submit')
      .setValue('#dob-day-input', '01')
      .setValue('#dob-month-input', '05')
      .setValue('#dob-year-input', '1955')
      .click('#date-of-birth-submit')

      // Prisoner relationship
      .waitForExist('#prisoner-relationship-submit')
      .click('#partner')
      .click('#prisoner-relationship-submit')

      // Benefit
      .waitForExist('#benefit-submit')
      .click('#income-support')
      .click('#benefit-submit')

      // About the Prisoner
      .waitForExist('#about-the-prisoner-submit')
      .setValue('#prisoner-first-name', 'Joe')
      .setValue('#prisoner-last-name', 'Bloggs')
      .setValue('#dob-day', '01')
      .setValue('#dob-month', '05')
      .setValue('#dob-year', '1955')
      .setValue('#prisoner-number', 'A1234BC')
      .setValue('#prison-name', 'Hewell')
      .click('#about-the-prisoner-submit')

      // About you
      .waitForExist('#about-you-submit')
      .setValue('#title-input', 'Mr')
      .setValue('#first-name-input', 'Joe')
      .setValue('#last-name-input', 'Bloggs')
      .setValue('#national-insurance-number-input', 'AA123456A')
      .setValue('#house-number-and-street-input', '1')
      .setValue('#town-input', 'Town')
      .setValue('#county-input', 'County')
      .setValue('#post-code-input', 'AA123AA')
      .selectByVisibleText('#country-input', 'Northern Ireland')
      .setValue('#email-address-input', 'steven.william.alexander+apvstest@googlemail.com')
      .setValue('#phone-number-input', '0123456789')
      .click('#about-you-submit')

      // Future or past visit
      .waitForExist('#future-or-past-submit')
      .click('#past')
      .click('#future-or-past-submit')

      // Journey information
      .waitForExist('#journey-information-submit')
      .setValue('#date-of-journey-day', '26')
      .setValue('#date-of-journey-month', '10')
      .setValue('#date-of-journey-year', '2016')
      .click('#journey-information-submit')

      // Expense
      .waitForExist('#expenses-submit')
      .click('#car')
      .click('#bus')
      .click('#refreshment')
      .click('#expenses-submit')

      // Car
      .waitForExist('#car-details-submit')
      .click('#car-details-submit')

      // Bus #1
      .waitForExist('#bus-details-submit')
      .setValue('#from-input', 'Euston')
      .setValue('#to-input', 'Birmingham New Street')
      .click('#return-no')
      .setValue('#cost-input', '20')
      .click('#add-another-journey')
      .click('#bus-details-submit')

      // Bus #2 (add another journey)
      .waitForExist('#bus-details-submit')
      .setValue('#from-input', 'Birmingham New Street')
      .setValue('#to-input', 'Euston')
      .click('#return-no')
      .setValue('#cost-input', '20')
      .click('#bus-details-submit')

      // Light refreshment
      .waitForExist('#light-refreshment-details-submit')
      .click('#travel-time-over-five')
      .setValue('#cost-input', '7.99')
      .click('#light-refreshment-details-submit')

      // Claim summary
      .waitForExist('#claim-summary-submit')
      .click('#claim-summary-submit')

      // Bank account details
      .waitForExist('#bank-account-details-submit')
      .setValue('#account-number-input', '00123456')
      .setValue('#sort-code-input', '001122')
      .click('#bank-account-details-submit')

      // Application submitted
      .waitForExist('#reference')
  })
})
