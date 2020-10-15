const internalEligibilityHelper = require('../helpers/data/internal/internal-eligibility-helper')
const claimHelper = require('../helpers/data/claim-helper')
const dateFormatter = require('../../app/services/date-formatter')
// const path = require('path')

// const TEST_FILE_PATH = path.join(__dirname, '..', 'resources', 'testfile.jpg')

const expect = require('chai').expect

var todaysDate = dateFormatter.now()
describe('First Time Claim Flow', () => {
  // The reference will be generated as part of this flow. So capture it once it is generated.
  var caseworker = 'teste2e@test.com'

  it('should display each page in the first time eligibility flow', async () => {
    await browser.url('/assisted-digital?caseworker=teste2e@test.com')

    // Index
    var submitButton = await $('#start')
    await submitButton.click()

    // Start
    submitButton = await $('#start-submit')
    var noRadioButton = await $('[for="no"]')
    await noRadioButton.click()
    await submitButton.click()

    // Date of birth
    submitButton = await $('#date-of-birth-submit')
    var dobDayInput = await $('#dob-day-input')
    var dobMonthInput = await $('#dob-month-input')
    var dobYearInput = await $('#dob-year-input')
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
    var prisonerNumber = await $('#prisoner-number')
    var prisonName = await $('#prison-name-text-input')
    var nameOfPrisonLabel = await $('#NameOfPrison')
    await firstName.setValue('Joe')
    await lastName.setValue('Bloggs')
    await dobDayInput.setValue('01')
    await dobMonthInput.setValue('05')
    await dobYearInput.setValue('1955')
    await prisonerNumber.setValue('Z6541TS')
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
    await niNumber.setValue('TS876541T')
    await houseNumber.setValue('1')
    await town.setValue('Town')
    await county.setValue('County')
    await postcode.setValue('AA123AA')
    await country.selectByVisibleText('England')
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
    var yes = await $('[for="escort-yes"]')
    await yes.click()
    await submitButton.click()

    // Escort
    submitButton = await $('#about-escort-submit')
    firstName = await $('#first-name-input')
    lastName = await $('#last-name-input')
    dobDayInput = await $('#dob-day')
    dobMonthInput = await $('#dob-month')
    dobYearInput = await $('#dob-year')
    await firstName.setValue('Frank')
    await lastName.setValue('Smith')
    await dobDayInput.setValue('15')
    await dobMonthInput.setValue('07')
    await dobYearInput.setValue('1985')
    await submitButton.click()

    // Has Child
    submitButton = await $('#has-child-submit')
    yes = await $('[for="child-yes"]')
    await yes.click()
    await submitButton.click()

    // About Child #1
    submitButton = await $('#about-child-submit')
    firstName = await $('#first-name-input')
    lastName = await $('#last-name-input')
    dobDayInput = await $('#dob-day-input')
    dobMonthInput = await $('#dob-month-input')
    dobYearInput = await $('#dob-year-input')
    var whoseChild = await $('[for="my-child"]')
    var addAnother = await $('[for="add-another-child"]')
    await firstName.setValue('Sam')
    await lastName.setValue('Bloggs')
    await dobDayInput.setValue('15')
    await dobMonthInput.setValue('05')
    await dobYearInput.setValue('2014')
    await whoseChild.click()
    await addAnother.click()
    await submitButton.click()

    // Allow second child page to load
    await browser.pause(3000)

    // About Child #2
    submitButton = await $('#about-child-submit')
    firstName = await $('#first-name-input')
    lastName = await $('#last-name-input')
    dobDayInput = await $('#dob-day-input')
    dobMonthInput = await $('#dob-month-input')
    dobYearInput = await $('#dob-year-input')
    whoseChild = await $('[for="prisoners-child"]')
    await firstName.setValue('Lewis')
    await lastName.setValue('Bloggs')
    await dobDayInput.setValue('20')
    await dobMonthInput.setValue('12')
    await dobYearInput.setValue('2013')
    await whoseChild.click()
    await submitButton.click()

    // Expense
    submitButton = await $('#expenses-submit')
    var car = await $('[for="car"]')
    var bus = await $('[for="bus"]')
    var refreshment = await $('[for="refreshment"]')
    await car.click()
    await bus.click()
    await refreshment.click()
    await submitButton.click()

    // Car
    submitButton = await $('#car-details-submit')
    await submitButton.click()

    // Bus #1 (adult expense)
    submitButton = await $('#bus-details-submit')
    var whoseTicket = await $('[for="is-child-ticket"]')
    var from = await $('#from-input')
    var to = await $('#to-input')
    var returnNo = await $('[for="return-no"]')
    var cost = await $('#cost-input')
    addAnother = await $('[for="add-another-journey"]')
    await whoseTicket.click()
    await from.setValue('Euston')
    await to.setValue('Birmingham New Street')
    await returnNo.click()
    await cost.setValue('20')
    await addAnother.click()
    await submitButton.click()

    // Allow second bus page to load
    await browser.pause(3000)

    // Bus #2 (add another journey) (child expense)
    submitButton = await $('#bus-details-submit')
    whoseTicket = await $('[for="is-escort-ticket"]')
    from = await $('#from-input')
    to = await $('#to-input')
    returnNo = await $('[for="return-no"]')
    cost = await $('#cost-input')
    await whoseTicket.click()
    await from.setValue('Euston')
    await to.setValue('Birmingham New Street')
    await returnNo.click()
    await cost.setValue('20')
    await submitButton.click()

    // Light refreshment
    submitButton = await $('#light-refreshment-details-submit')
    cost = await $('#cost-input')
    await cost.setValue('7.99')
    await submitButton.click()

    // Claim summary
    var addVisitConfirmation = await $('#add-visit-confirmation')
    await addVisitConfirmation.click()

    // Upload visit confirmation
    submitButton = await $('#file-upload-submit')
    var post = await $('[for="Post"]')
    await post.click()
    await submitButton.click()

    // TODO Fix document upload
    // var document = await $('#document')
    // await document.click()
    // await document.setValue(TEST_FILE_PATH)
    // await document.pause(5000)

    // Claim summary
    var addExpenseReceipt = await $('.add-expense-receipt')
    await addExpenseReceipt.click()

    // Upload Receipt Bus Adult
    submitButton = await $('#file-upload-submit')
    post = await $('[for="Post"]')
    await post.click()
    await submitButton.click()

    // Claim summary
    addExpenseReceipt = await $('.add-expense-receipt')
    await addExpenseReceipt.click()

    // Upload Receipt Bus Child
    submitButton = await $('#file-upload-submit')
    post = await $('[for="Post"]')
    await post.click()
    await submitButton.click()

    // Car journey and light refreshment do not require receipts

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
    return claimHelper.getRef(caseworker)
      .then(function (reference) {
        return internalEligibilityHelper.deleteAll(reference)
      })
  })
})
