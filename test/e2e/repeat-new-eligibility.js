const internalEligibilityHelper = require('../helpers/data/internal/internal-eligibility-helper')
const internalVisitorHelper = require('../helpers/data/internal/internal-visitor-helper')
const dateFormatter = require('../../app/services/date-formatter')
const referenceGenerator = require('../../app/services/reference-generator')

const expect = require('chai').expect

var todaysDate = dateFormatter.now()
describe('Repeat claim with new eligibility details', function () {
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
    var changeYourDetails = await $('#change-your-details')
    await changeYourDetails.click()

    // Date of birth
    submitButton = await $('#date-of-birth-submit')
    dobDayInput = await $('#dob-day-input')
    dobMonthInput = await $('#dob-month-input')
    dobYearInput = await $('#dob-year-input')
    await dobDayInput.setValue('01')
    await dobMonthInput.setValue('05')
    await dobYearInput.setValue('1955')
    await submitButton.click()

    // Prisoner relationship
    submitButton = await $('#prisoner-relationship-submit')
    var partnerButton = await $('[for="partner"]')
    await partnerButton.click()
    await submitButton.click()

    // Benefit
    submitButton = await $('#benefit-submit')
    var incomeSupportButton = await $('[for="income-support"]')
    var yesButton = await $('[for="yes"]')
    await incomeSupportButton.click()
    await yesButton.click()
    await submitButton.click()

    // About the Prisoner
    submitButton = await $('#about-the-prisoner-submit')
    var firstName = await $('#prisoner-first-name')
    var lastName = await $('#prisoner-last-name')
    dobDayInput = await $('#dob-day')
    dobMonthInput = await $('#dob-month')
    dobYearInput = await $('#dob-year')
    var prisonName = await $('#prison-name-text-input')
    var nameOfPrisonLabel = await $('#NameOfPrison')
    await firstName.setValue('Joe')
    await lastName.setValue('Bloggs')
    await dobDayInput.setValue('01')
    await dobMonthInput.setValue('05')
    await dobYearInput.setValue('1955')
    await prisonName.setValue('Hewell')
    await nameOfPrisonLabel.click() // click label to remove input focus
    await submitButton.click()

    // About you
    submitButton = await $('#about-you-submit')
    firstName = await $('#first-name-input')
    lastName = await $('#last-name-input')
    var niNumber = await $('#national-insurance-number-input')
    var houseNumber = await $('#house-number-and-street-input')
    var town = await $('#town-input')
    var county = await $('#county-input')
    var postcode = await $('#post-code-input')
    var country = await $('#country-input')
    var email = await $('#email-address-input')
    var phone = await $('#phone-number-input')
    await firstName.setValue('Joe')
    await lastName.setValue('Bloggs')
    await niNumber.setValue('TS876545T')
    await houseNumber.setValue('1')
    await town.setValue('Town')
    await county.setValue('County')
    await postcode.setValue('AA123AA')
    await country.selectByVisibleText('Northern Ireland')
    await email.setValue('donotsend@apvs.com')
    await phone.setValue('0123456789')
    await submitButton.click()

    // Future or past visit
    submitButton = await $('#future-or-past-submit')
    var past = await $('[for="past"]')
    await past.click()
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

    // Has Escort
    submitButton = await $('#has-escort-submit')
    var no = await $('[for="escort-no"]')
    await no.click()
    await submitButton.click()

    // Has Child
    submitButton = await $('#has-child-submit')
    no = await $('[for="child-no"]')
    await no.click()
    await submitButton.click()

    // Expense
    submitButton = await $('#expenses-submit')
    var bus = await $('[for="bus"]')
    await bus.click()
    await submitButton.click()

    // Bus #1 (adult expense)
    submitButton = await $('#bus-details-submit')
    var from = await $('#from-input')
    var to = await $('#to-input')
    var returnNo = await $('[for="return-no"]')
    var cost = await $('#cost-input')
    await from.setValue('Euston')
    await to.setValue('Birmingham New Street')
    await returnNo.click()
    await cost.setValue('20')
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
