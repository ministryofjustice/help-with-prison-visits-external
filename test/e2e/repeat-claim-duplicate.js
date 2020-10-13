const internalEligibilityHelper = require('../helpers/data/internal/internal-eligibility-helper')
const internalVisitorHelper = require('../helpers/data/internal/internal-visitor-helper')
const dateFormatter = require('../../app/services/date-formatter')
const referenceGenerator = require('../../app/services/reference-generator')

const expect = require('chai').expect

var todaysDate = dateFormatter.now()
describe('Repeat claim duplicate claim', function () {
  const REFERENCE = referenceGenerator.generate()

  before(function () {
    return internalEligibilityHelper.insertEligibilityAndClaim(REFERENCE)
  })

  it('should display each page in the repeat claim flow', async () => {
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
    submitButton = await $('#new-claim')
    await submitButton.click()

    // Check your information
    submitButton = await $('#continue')
    var confirm = await $('[for="confirm-correct"]')
    await confirm.click()
    await submitButton.click()

    // Future or past visit
    submitButton = await $('#future-or-past-submit')
    var past = await $('[for="past"]')
    await past.click()
    await submitButton.click()

    // Same journey as your last claim
    submitButton = await $('#same-journey-as-last-claim-submit')
    yesRadioButton = await $('[for="yes"]')
    await yesRadioButton.click()
    await submitButton.click()

    // Journey information
    submitButton = await $('#journey-information-submit')
    var dayInput = await $('#date-of-journey-day')
    var monthInput = await $('#date-of-journey-month')
    var yearInput = await $('#date-of-journey-year')
    await dayInput.setValue(todaysDate.date())
    await monthInput.setValue(todaysDate.month() + 1)
    await yearInput.setValue(todaysDate.year())
    await submitButton.click()

    // Claim summary
    var addVisitConfirmation = await $('#add-visit-confirmation')
    await addVisitConfirmation.click()

    // Upload visit confirmation
    submitButton = await $('#file-upload-submit')
    var post = await $('[for="Post"]')
    await post.click()
    await submitButton.click()

    // Claim summary
    var addExpenseReceipt = await $('.add-expense-receipt')
    await addExpenseReceipt.click()

    // Upload Receipt Bus Adult
    submitButton = await $('#file-upload-submit')
    post = await $('[for="Post"]')
    await post.click()
    await submitButton.click()

    // Claim summary
    submitButton = await $('#claim-summary-submit')
    await submitButton.click()

    // Enter Bank Account Details
    submitButton = await $('#bank-payment-submit')
    var nameOnAccount = await $('#name-on-account-input')
    var sortCode = await $('#sort-code-input')
    var accountNumber = await $('#account-number-input')
    await nameOnAccount.setValue('Joe Bloggs')
    await sortCode.setValue('001122')
    await accountNumber.setValue('00123456')
    await submitButton.click()

    // Declaration page
    submitButton = await $('#claim-submit')
    var tAndC = await $('[for="terms-and-conditions-input"]')
    await tAndC.click()
    await submitButton.click()

    // Application submitted
    var title = await browser.getTitle()
    expect(title).to.be.equal('Application submitted - Get help with the cost of prison visits')
  })

  after(function () {
    return internalEligibilityHelper.deleteAll(REFERENCE)
  })
})
