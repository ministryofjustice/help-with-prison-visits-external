// TODO: Will need to add check on each of the pages that has a constructed URL path.

describe('First time claim flow', () => {
  it('should display each page in the first time eligibility flow', () => {
    return browser.url('/')

      // Index
      .click('#start')

      // Start
      .waitForExist('#first-time-submit')
      .click('#first-time-submit')

      // Date of Birth
      .waitForExist('#date-of-birth-submit')
      .setValue('#dob-day-input', '01')
      .setValue('#dob-month-input', '05')
      .setValue('#dob-year-input', '1955')
      .click('#date-of-birth-submit')

      // Prisoner Relationship
      .waitForExist('#prisoner-relationship-submit')
      .click('#partner')
      .click('#prisoner-relationship-submit')

      // Journey Assistance
      .waitForExist('#journey-assistance-submit')
      .click('#assistance-no')
      .click('#journey-assistance-submit')

      // Benefit
      .waitForExist('#benefit-submit')
      .click('#income-support')
      .click('#benefit-submit')

      .waitForExist('#about-the-prisoner-submit')
  })
})
