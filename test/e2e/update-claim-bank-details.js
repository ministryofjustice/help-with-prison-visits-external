const internalEligibilityHelper = require('../helpers/data/internal/internal-eligibility-helper')
const internalVisitorHelper = require('../helpers/data/internal/internal-visitor-helper')
const referenceGenerator = require('../../app/services/reference-generator')

const expect = require('chai').expect

describe('Claim payment information requested', function () {
  const REFERENCE = referenceGenerator.generate()

  before(function () {
    return internalEligibilityHelper.insertEligibilityAndClaim(REFERENCE, 'REQUEST-INFO-PAYMENT')
  })

  it('should display update bank details', async () => {
    await browser.url('/assisted-digital?caseworker=teste2e@test.com')

    // Index
    var submitButton = await $('#start')
    await submitButton.click()

    // Start
    submitButton = await $('#start-submit')
    var yesRadioButton = await $('[for="yes"]')
    await yesRadioButton.click()
    await submitButton.click()

    // Start already registered
    submitButton = await $('#already-registered-submit')
    var referenceInput = await $('#reference-input')
    var dobDayInput = await $('#dob-day-input')
    var dobMonthInput = await $('#dob-month-input')
    var dobYearInput = await $('#dob-year-input')
    await referenceInput.setValue(REFERENCE)
    await dobDayInput.setValue(internalVisitorHelper.DAY)
    await dobMonthInput.setValue(internalVisitorHelper.MONTH)
    await dobYearInput.setValue(internalVisitorHelper.YEAR)
    await submitButton.click()

    // Your Claims
    submitButton = await $('#add-info')
    await submitButton.click()

    // Click to add visit confirmation
    var updateVisitConfirmation = await $('#update-visit-confirmation')
    await updateVisitConfirmation.click()

    // Post Later visit confirmation
    submitButton = await $('#file-upload-submit')
    var post = await $('[for="Post"]')
    await post.click()
    await submitButton.click()

    // Add message to claim and submit
    submitButton = await $('#claim-view-submit')
    var messageToCaseworker = await $('#message-to-caseworker')
    var nameOnAccount = await $('#name-on-account-input')
    var sortCode = await $('#sort-code-input')
    var accountNumber = await $('#account-number-input')
    await messageToCaseworker.setValue('Sorry about that, my bank account information has been corrected.')
    await nameOnAccount.setValue('Joe Bloggs')
    await sortCode.setValue('223344')
    await accountNumber.setValue('11223344')
    await submitButton.click()

    // Updated view claims page
    var applicationUpdated = await $('#application-updated')
    var applicationUpdatedText = await applicationUpdated.getText()

    expect(applicationUpdatedText).to.be.equal('Application updated')
  })

  after(function () {
    return internalEligibilityHelper.deleteAll(REFERENCE)
  })
})
