// TODO: We will need to persist test data to the database prior to running this test once the check on the reference number/dob combination existing is in place.
describe('Repeat Claim Flow', () => {
  it('should display each page in the repeat claim flow', () => {
    return browser.url('/')

      // Index
      .waitForExist('#start')
      .click('#start')

      // Start
      .waitForExist('#already-registered-submit')
      .setValue('#reference', 'APVS123') // TODO: This should be replaced with the persisted reference.
      .setValue('#dob-day-input', '01')
      .setValue('#dob-month-input', '05')
      .setValue('#dob-year-input', '1955')
      .click('#already-registered-submit')

      // Your Claims
      .waitForExist('#your-claims-submit')
  })
})
