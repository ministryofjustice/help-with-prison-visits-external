const getMaskedEligibility = require('./data/get-masked-eligibility')
const getEligibilityVisitorUpdatedContactDetail = require('./data/get-eligibility-visitor-updated-contact-detail')

module.exports = function (reference, dob, eligibilityId) {
  return getMaskedEligibility(reference, dob, eligibilityId)
    .then(function (eligibility) {
      return getEligibilityVisitorUpdatedContactDetail(reference, eligibility.EligibilityId)
        .then(function (contactDetails) {
          if (contactDetails) {
            eligibility.EmailAddress = contactDetails.EmailAddress
            eligibility.PhoneNumber = contactDetails.PhoneNumber
          }
          return eligibility
        })
    })
}
