const expect = require('chai').expect

describe('Smoke test', () => {
  const REFERENCE = 'AAAAAAA'

  it('should display already registered page and check database for non-existent reference', async () => {
    await browser.url('/start-already-registered')
    // Start already registered
    var referenceInput = await $('#reference-input')
    await referenceInput.setValue(REFERENCE)

    var dobDayInput = await $('#dob-day-input')
    await dobDayInput.setValue('13')

    var dobMonthInput = await $('#dob-month-input')
    await dobMonthInput.setValue('01')

    var dobYearInput = await $('#dob-year-input')
    await dobYearInput.setValue('1900')

    var submitButton = await $('#already-registered-submit')
    await submitButton.click()

    var title = await browser.getTitle()
    expect(title).to.be.equal('Return visitor sign in - Get help with the cost of prison visits')
  })
})
