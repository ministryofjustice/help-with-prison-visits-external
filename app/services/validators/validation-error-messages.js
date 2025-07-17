module.exports = {
  getIsRequired(displayName) {
    return `${displayName} is required`
  },
  getRadioQuestionIsRequired(displayName) {
    return `Select a ${displayName}`
  },
  getIsAlpha(displayName) {
    return `${displayName} must only contain letters`
  },
  getIsNumeric(displayName) {
    return `${displayName} can only contain numbers`
  },
  getIsLengthMessage(displayName, options) {
    return `${displayName} must be ${options.length} characters long`
  },
  getIsRangeMessage(displayName, options) {
    return `${displayName} must be between ${options.min} and ${options.max} characters`
  },
  getIsLessThanLengthMessage(displayName, options) {
    return `${displayName} must be shorter than ${options.length} characters`
  },
  getInvalidDateFormatMessage(displayName) {
    return `${displayName} was invalid`
  },
  getFutureDateMessage(displayName) {
    return `${displayName} must be in the future`
  },
  getPastDateMessage(displayName) {
    return `${displayName} must be in the past`
  },
  getIsValidFormat(displayName) {
    return `${displayName} must have valid format`
  },
  getIsCurrency(displayName) {
    return `${displayName} must be a valid amount`
  },
  getIsGreaterThan(displayName) {
    return `${displayName} must be greater than zero`
  },
  getDateSetDaysAway(displayName, options) {
    return `${displayName} must be within ${options.days} days`
  },
  getNotDateSetDaysAway(displayName, options) {
    return `${displayName} must not be within ${options.days} days`
  },
  getIsYoungerThan(displayName, options) {
    return `Must be under ${options.years} years of age`
  },
  getIsOlderThan(displayName, options) {
    return `Must be over ${options.years} years of age`
  },
  getIsValidOption(displayName) {
    return `${displayName} must be a valid option`
  },
  getUploadTooLarge: 'File uploaded too large',
  getUploadIncorrectType: 'File uploaded was not an image or pdf',
  getUploadFileAndAlternativeSelected: 'Both file uploaded and alternative option selected',
  getInvalidReferenceNumberAndDob: 'Could not find any claims for these details',
  getExpiredSession: 'Your session has expired, please enter your reference number and date of birth again',
  getExpiredSessionDOB: 'Your session has expired, please enter your date of birth again',
  getReferenceDisabled: 'This Reference Number has been disbaled and cannot be used to submit a claim',
  getMadeClaimForPrisonerBeforeIsRequired: 'You must confirm if you have made a claim before',
  getNoUpdatesMade:
    'No updates were made, please ensure all documents are uploaded for your application to be processed or send a message to your caseworker. Otherwise press cancel to return to your claims',
  getInvalidReference: 'Reference is invalid',
  getMalwareDetected:
    'We have detected a virus in this file and can not accept it. Please upload a virus free version.',
  getNoExpensesClaimedFor() {
    return 'All expenses were removed, add an expense to continue'
  },
  getEnterYourDateOfBirth() {
    return 'Enter your date of birth'
  },
  getBenefitRequired() {
    return 'Choose a benefit from the list'
  },
  getBenefitOwnerRequired() {
    return 'You must confirm if you are the benefit owner'
  },
  getEnterPrisonerFirstName() {
    return "Enter the prisoner's first name"
  },
  getEnterPrisonerLastName() {
    return "Enter the prisoner's last name"
  },
  getEnterPrisonerDateOfBirth() {
    return "Enter the prisoner's date of birth"
  },
  getEnterPrisonerNumber() {
    return 'Enter a prison number'
  },
  getEnterPrison() {
    return 'Enter the name of the prison'
  },
  getEnterYourFirstName() {
    return 'Enter your first name'
  },
  getEnterYourLastName() {
    return 'Enter your last name'
  },
  getEnterYourNINNumber() {
    return 'Enter your National Insurance number'
  },
  getEnterYourHouseNumber() {
    return 'Enter your house number and street'
  },
  getEnterYourTown() {
    return 'Enter your town'
  },
  getEnterYourCounty() {
    return 'Enter your county'
  },
  getEnterYourPostcode() {
    return 'Enter your postcode'
  },
  getSelectACountry() {
    return 'Select a country'
  },
  getEnterYourEmailAddress() {
    return 'Enter your email address'
  },
  getEnterDateOfVisit() {
    return 'Enter the date of your prison visit'
  },
  getClaimingForEscort() {
    return 'Tell us if you are claiming for an escort'
  },
  getEnterEscortFirstName() {
    return "Enter the escort's first name"
  },
  getEnterEscortLastName() {
    return "Enter the escort's last name"
  },
  getEnterEscortDateOfBirth() {
    return "Enter the escort's date of birth"
  },
  getEnterEscortNINumber() {
    return "Enter the escort's National Insurance number"
  },
  getClaimingForChild() {
    return 'Tell us if you are claiming for any children'
  },
  getEnterChildFirstName() {
    return "Enter the child's first name"
  },
  getEnterChildLastName() {
    return "Enter the child's last name"
  },
  getEnterChildDateOfBirth() {
    return "Enter the child's date of birth"
  },
  getEnterChildRelationship() {
    return "Enter the child's relationship"
  },
  getSelectAnExpense() {
    return 'Tell us which transport and other expenses you want to claim for'
  },
  getEnterCost() {
    return 'Enter the cost'
  },
  getEnterTollCost() {
    return 'Enter the cost of the toll'
  },
  getEnterParkingCost() {
    return 'Enter the cost of the parking charge'
  },
  getEnterFrom() {
    return 'Enter the journey start point'
  },
  getEnterTo() {
    return 'Enter the journey end point'
  },
  getReturn() {
    return 'Tell us if this is a return journey'
  },
  getTicketOwner() {
    return 'Tell us whose ticket you are claiming for'
  },
  getEnterDepartureTime() {
    return 'Enter the departure time'
  },
  getEnterNumberOfDays() {
    return 'Enter the number of days for car hire'
  },
  getTicketType() {
    return 'Tell us what type of ticket you are claiming for'
  },
  getEnterNightsStayed() {
    return 'Enter the number of nights stayed'
  },
  getDocumentOnSummary(displayName) {
    return `Add your ${displayName.toLowerCase()} now or choose to send it later`
  },
  getDocumentNeeded(displayName) {
    return `${displayName} needed`
  },
  getEnterAccountNumber() {
    return 'Enter your account number'
  },
  getEnterSortCode() {
    return 'Enter your sort code'
  },
  getDisclaimer() {
    return 'You must agree to the declaration to finish your application'
  },
  getEnterReference() {
    return 'Enter your reference number'
  },
  getPrisonerNameLessThanLengthMessage(displayName, options) {
    return `Prisoner's ${displayName.toLowerCase()} must be shorter than ${options.length} characters`
  },
  getClaimantNameLessThanLengthMessage(displayName, options) {
    return `Your ${displayName.toLowerCase()} must be shorter than ${options.length} characters`
  },
  getEscortNameLessThanLengthMessage(displayName, options) {
    return `Escort's ${displayName.toLowerCase()} must be shorter than ${options.length} characters`
  },
  getChildNameLessThanLengthMessage(displayName, options) {
    return `Child's ${displayName.toLowerCase()} must be shorter than ${options.length} characters`
  },
  getIsLengthDigitsMessage(displayName, options) {
    return `${displayName} must be ${options.length} digits long`
  },
  getIsValidReference() {
    return 'Reference can only contain numbers and letters'
  },
  getFutureDateSetDaysAway(displayName, options) {
    return `${displayName} must be in the next ${options.days} days`
  },
  getPastDateSetDaysAway(displayName, options) {
    return `${displayName} must be in the last ${options.days} days. To continue enter a valid visit date in the last ${options.days} days`
  },
  getUploadRequired() {
    return 'Upload your document now or choose to send it later'
  },
  getEnterReturnTime() {
    return 'Enter the return time of your train home'
  },
  getPaymentMethod() {
    return 'Tell us how you want to be paid'
  },
  getNewCarDestination() {
    return 'Enter the destination of your car journey'
  },
  getNewCarOrigin() {
    return 'Enter the starting point of your car journey'
  },
  getNewCarOriginPostcode() {
    return 'Enter the Postcode of the starting point of your car journey'
  },
  getIsIntegerFormat(displayName) {
    return `${displayName} must be a whole number`
  },
  getValueIsTooLarge(displayName) {
    return `${displayName} value is too large for this field`
  },
  getExpenseDisabled() {
    return 'You cannot upload a document for this expense as it has already been deleted'
  },
  getIsPhoneNumberLessThanLengthMessage(displayName, options) {
    return `${displayName} must be ${options.length} characters or less`
  },
  getCostIsTooLarge(displayName, options) {
    return `${displayName} must be £${options.cost} or less`
  },
  getVisitDateBeforeReleaseDateMessage(displayName) {
    return `${displayName} must be before the prisoner's release date`
  },
  getEnterBenefitOwnerFirstName() {
    return "Enter the benefit owner's first name"
  },
  getEnterBenefitOwnerLastName() {
    return "Enter the benefit owner's last name"
  },
  getEnterBenefitOwnerDateOfBirth() {
    return "Enter the benefit owner's date of birth"
  },
  getBenefitOwnerNameLessThanLengthMessage(displayName, options) {
    return `Benefit owner's ${displayName.toLowerCase()} must be shorter than ${options.length} characters`
  },
  getEnterBenefitOwnerNINNumber() {
    return "Enter the benefit owner's National Insurance number"
  },
  getIsAlreadyVisited() {
    return 'A claim has been submitted for this prisoner on the same date'
  },
  getNameOnAccount() {
    return 'Enter the name on the account'
  },
  getNameOnAccountLessThanLengthMessage(displayName, options) {
    return `The ${displayName.toLowerCase()} must be shorter than ${options.length} characters`
  },
  getRollNumberValidFormatMessage() {
    return 'Building society roll number must only include letters a to z, numbers, hyphens, spaces and full stops'
  },
}
