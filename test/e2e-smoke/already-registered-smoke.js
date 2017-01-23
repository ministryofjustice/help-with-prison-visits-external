describe('Smoke test', () => {
  const REFERENCE = 'AAAAAAA'

  it('should display already registered page and check database for non-existent reference', () => {
    return browser.url('/start-already-registered')
      // Start already registered
      .waitForExist('#already-registered-submit')
      .setValue('#reference', REFERENCE)
      .setValue('#dob-day-input', '13')
      .setValue('#dob-month-input', '01')
      .setValue('#dob-year-input', '1900')
      .click('#already-registered-submit')

      // returns same page with validation error after checking Database for reference
      .waitForExist('#already-registered-submit')
  })
})
