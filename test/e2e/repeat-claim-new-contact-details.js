const internalEligibilityHelper = require('../helpers/data/internal/internal-eligibility-helper')
const internalVisitorHelper = require('../helpers/data/internal/internal-visitor-helper')
const dateFormatter = require('../../app/services/date-formatter')
const referenceGenerator = require('../../app/services/reference-generator')

const expect = require('chai').expect

const todaysDate = dateFormatter.now()
describe('Repeat claim with new contact details', function () {
  const REFERENCE = referenceGenerator.generate()

  before(function () {
    return internalEligibilityHelper.insertEligibilityAndClaim(REFERENCE)
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
    submitButton = await $('#new-claim')
    await submitButton.click()

    // Check your information
    const changeContactDetails = await $('#change-contact-details')
    await changeContactDetails.click()

    // Change contact details
    submitButton = await $('#submit')
    const email = await $('#email-address')
    const phone = await $('#phone-number')
    await email.setValue('donotsend@apvs.com')
    await phone.setValue('9876543210')
    await submitButton.click()

    // Check your information
    submitButton = await $('#continue')
    const confirm = await $('[for="confirm-correct"]')
    await confirm.click()
    await submitButton.click()

    // Future or past visit
    submitButton = await $('#future-or-past-submit')
    const past = await $('[for="past"]')
    await past.click()
    await submitButton.click()

    // Same journey as your last claim
    submitButton = await $('#same-journey-as-last-claim-submit')
    const noRadioButton = await $('[for="no"]')
    await noRadioButton.click()
    await submitButton.click()

    // Journey information
    submitButton = await $('#journey-information-submit')
    const dayInput = await $('#date-of-journey-day')
    const monthInput = await $('#date-of-journey-month')
    const yearInput = await $('#date-of-journey-year')
    await dayInput.setValue(todaysDate.date())
    await monthInput.setValue(todaysDate.month() + 1)
    await yearInput.setValue(todaysDate.year())
    await submitButton.click()

    // Has Escort
    submitButton = await $('#has-escort-submit')
    let no = await $('[for="escort-no"]')
    await no.click()
    await submitButton.click()

    // Has Child
    submitButton = await $('#has-child-submit')
    no = await $('[for="child-no"]')
    await no.click()
    await submitButton.click()

    // Expense
    submitButton = await $('#expenses-submit')
    const bus = await $('[for="bus"]')
    await bus.click()
    await submitButton.click()

    // Bus #1 (adult expense)
    submitButton = await $('#bus-details-submit')
    const from = await $('#from-input')
    const to = await $('#to-input')
    const returnNo = await $('[for="return-no"]')
    const cost = await $('#cost-input')
    await from.setValue('Euston')
    await to.setValue('Birmingham New Street')
    await returnNo.click()
    await cost.setValue('20')
    await submitButton.click()

    // Claim summary
    const addVisitConfirmation = await $('#add-visit-confirmation')
    await addVisitConfirmation.click()

    // Upload visit confirmation
    submitButton = await $('#file-upload-submit')
    let post = await $('[for="Post"]')
    await post.click()
    await submitButton.click()

    // Claim summary
    const addExpenseReceipt = await $('.add-expense-receipt')
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
    const nameOnAccount = await $('#name-on-account-input')
    const sortCode = await $('#sort-code-input')
    const accountNumber = await $('#account-number-input')
    await nameOnAccount.setValue('Joe Bloggs')
    await sortCode.setValue('001122')
    await accountNumber.setValue('00123456')
    await submitButton.click()

    // Declaration page
    submitButton = await $('#claim-submit')
    const tAndC = await $('[for="terms-and-conditions-input"]')
    await tAndC.click()
    await submitButton.click()

    // Application submitted
    const title = await browser.getTitle()
    expect(title).to.be.equal('Application submitted - Get help with the cost of prison visits')
  })

  after(function () {
    return internalEligibilityHelper.deleteAll(REFERENCE)
  })
})
