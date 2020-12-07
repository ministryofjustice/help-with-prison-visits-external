const internalEligibilityHelper = require('../helpers/data/internal/internal-eligibility-helper')
const internalVisitorHelper = require('../helpers/data/internal/internal-visitor-helper')
const dateFormatter = require('../../app/services/date-formatter')
const referenceGenerator = require('../../app/services/reference-generator')

const expect = require('chai').expect

const todaysDate = dateFormatter.now()
describe('Repeat claim with new eligibility details', function () {
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
    let dobDayInput = await $('#dob-day-input')
    let dobMonthInput = await $('#dob-month-input')
    let dobYearInput = await $('#dob-year-input')
    await referenceInput.setValue(REFERENCE)
    await dobDayInput.setValue(internalVisitorHelper.DAY)
    await dobMonthInput.setValue(internalVisitorHelper.MONTH)
    await dobYearInput.setValue(internalVisitorHelper.YEAR)
    await submitButton.click()

    // Your Claims
    submitButton = await $('#new-claim')
    await submitButton.click()

    // Check your information
    const changeYourDetails = await $('#change-your-details')
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
    const partnerButton = await $('[for="partner"]')
    await partnerButton.click()
    await submitButton.click()

    // Benefit
    submitButton = await $('#benefit-submit')
    const incomeSupportButton = await $('[for="income-support"]')
    const yesButton = await $('[for="yes"]')
    await incomeSupportButton.click()
    await yesButton.click()
    await submitButton.click()

    // About the Prisoner
    submitButton = await $('#about-the-prisoner-submit')
    let firstName = await $('#prisoner-first-name')
    let lastName = await $('#prisoner-last-name')
    dobDayInput = await $('#dob-day')
    dobMonthInput = await $('#dob-month')
    dobYearInput = await $('#dob-year')
    const prisonName = await $('#prison-name-text-input')
    const nameOfPrisonLabel = await $('#NameOfPrison')
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
    const niNumber = await $('#national-insurance-number-input')
    const houseNumber = await $('#house-number-and-street-input')
    const town = await $('#town-input')
    const county = await $('#county-input')
    const postcode = await $('#post-code-input')
    const country = await $('#country-input')
    const email = await $('#email-address-input')
    const phone = await $('#phone-number-input')
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
    const past = await $('[for="past"]')
    await past.click()
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
