const internalEligibilityHelper = require('../helpers/data/internal/internal-eligibility-helper')
const dateFormatter = require('../../app/services/date-formatter')
const claimHelper = require('../helpers/data/claim-helper')
const expect = require('chai').expect

const futureDate = dateFormatter.now().add(14, 'days')
describe('First Time Advance Claim Flow', () => {
  // The reference will be generated as part of this flow. So capture it once it is generated.
  // var reference
  const caseworker = 'teste2e@test.com'

  it('should display each page in the first time eligibility flow Advance', async () => {
    await browser.url('/assisted-digital?caseworker=teste2e@test.com')

    // Index
    let submitButton = await $('#start')
    await submitButton.click()

    // Start
    submitButton = await $('#start-submit')
    const noRadioButton = await $('[for="no"]')
    await noRadioButton.click()
    await submitButton.click()

    // Date of birth
    submitButton = await $('#date-of-birth-submit')
    let dobDayInput = await $('#dob-day-input')
    let dobMonthInput = await $('#dob-month-input')
    let dobYearInput = await $('#dob-year-input')
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
    const prisonerNumber = await $('#prisoner-number')
    const prisonName = await $('#prison-name-text-input')
    const nameOfPrisonLabel = await $('#NameOfPrison')
    await firstName.setValue('Joe')
    await lastName.setValue('Bloggs')
    await dobDayInput.setValue('01')
    await dobMonthInput.setValue('05')
    await dobYearInput.setValue('1955')
    await prisonerNumber.setValue('Z6543TS')
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
    await niNumber.setValue('TS876543T')
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
    const advance = await $('[for="advance"]')
    await advance.click()
    await submitButton.click()

    // Journey information
    submitButton = await $('#journey-information-submit')
    const dayInput = await $('#date-of-journey-day')
    const monthInput = await $('#date-of-journey-month')
    const yearInput = await $('#date-of-journey-year')
    await dayInput.setValue(futureDate.date())
    await monthInput.setValue(futureDate.month() + 1)
    await yearInput.setValue(futureDate.year())
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
    const train = await $('[for="train"]')
    await train.click()
    await submitButton.click()

    // Train - With departure time rather than cost field.
    submitButton = await $('#train-details-submit')
    const from = await $('#from-input')
    const to = await $('#to-input')
    const returnYes = await $('[for="return-yes"]')
    const departureTime = await $('#departure-time-input')
    const returnTime = await $('#return-time-input')
    await from.setValue('Euston')
    await to.setValue('Birmingham New Street')
    await returnYes.click()
    await departureTime.setValue('10am')
    await returnTime.setValue('4pm')
    await submitButton.click()

    // Claim summary (advance claims do not need visit confirmation/expense upload)
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
    return claimHelper.getRef(caseworker)
      .then(function (reference) {
        return internalEligibilityHelper.deleteAll(reference)
      })
  })
})
