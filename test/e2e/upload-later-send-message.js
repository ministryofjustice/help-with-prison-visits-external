const internalEligibilityHelper = require('../helpers/data/internal/internal-eligibility-helper')
const internalVisitorHelper = require('../helpers/data/internal/internal-visitor-helper')
const referenceGenerator = require('../../app/services/reference-generator')
const expect = require('chai').expect

describe('Upload later and send a message', function () {
  const REFERENCE = referenceGenerator.generate()

  before(function () {
    return internalEligibilityHelper.insertEligibilityAndClaim(REFERENCE, 'PENDING')
  })

  it('should display each page in the repeat claim flow', async () => {
    await browser.url('/assisted-digital?caseworker=teste2e@test.com')

    // Index
    let submitButton = await $('#start')
    await submitButton.click()

    // Start
    submitButton = await $('#start-submit')
    const yesRadioButton = await $('[for="yes"]')
    await yesRadioButton.click()
    await submitButton.click()

    // Start already registered
    submitButton = await $('#already-registered-submit')
    const referenceInput = await $('#reference-input')
    const dobDayInput = await $('#dob-day-input')
    const dobMonthInput = await $('#dob-month-input')
    const dobYearInput = await $('#dob-year-input')
    await referenceInput.setValue(REFERENCE)
    await dobDayInput.setValue(internalVisitorHelper.DAY)
    await dobMonthInput.setValue(internalVisitorHelper.MONTH)
    await dobYearInput.setValue(internalVisitorHelper.YEAR)
    await submitButton.click()

    // Your Claims
    submitButton = await $('#add-info')
    await submitButton.click()

    // Click to add visit confirmation
    const updateVisitConfirmation = await $('#update-visit-confirmation')
    await updateVisitConfirmation.click()

    // Post Later visit confirmation
    submitButton = await $('#file-upload-submit')
    const post = await $('[for="Post"]')
    await post.click()
    await submitButton.click()

    // Add message to claim and submit
    submitButton = await $('#claim-view-submit')
    const messageToCaseworker = await $('#message-to-caseworker')
    await messageToCaseworker.setValue('Sorry I have lost my bus receipt, is it ok to still approve my claim? I will post the other as soon as I can.')
    await submitButton.click()

    // Updated view claims page
    const applicationUpdated = await $('#application-updated')
    const applicationUpdatedText = await applicationUpdated.getText()

    expect(applicationUpdatedText).to.be.equal('Application updated')
  })

  after(function () {
    return internalEligibilityHelper.deleteAll(REFERENCE)
  })
})
