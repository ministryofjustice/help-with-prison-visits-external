const expect = require('chai').expect

describe('Smoke test', () => {
  const REFERENCE = 'AAAAAAA'

  it('should display already registered page and check database for non-existent reference', async () => {
    await browser.url('/start-already-registered')
    // Start already registered
    const referenceInput = await $('#reference-input')
    await referenceInput.setValue(REFERENCE)

    const dobDayInput = await $('#dob-day-input')
    await dobDayInput.setValue('13')

    const dobMonthInput = await $('#dob-month-input')
    await dobMonthInput.setValue('01')

    const dobYearInput = await $('#dob-year-input')
    await dobYearInput.setValue('1900')

    const submitButton = await $('#already-registered-submit')
    await submitButton.click()

    const title = await browser.getTitle()
    expect(title).to.be.equal('Return visitor sign in - Get help with the cost of prison visits')
  })
})
