const { getDatabaseConnector } = require('../../databaseConnector')
const UpdateContactDetail = require('../domain/updated-contact-details')
const dateFormatter = require('../date-formatter')

module.exports = function (reference, eligibilityId, updatedContactDetail) {
  if (!(updatedContactDetail instanceof UpdateContactDetail)) {
    throw new Error('Provided updatedContactDetail object is not an instance of the expected class')
  }

  const db = getDatabaseConnector()

  return db('EligibilityVisitorUpdateContactDetail').insert({
    EligibilityId: eligibilityId,
    Reference: reference,
    EmailAddress: updatedContactDetail.emailAddress,
    PhoneNumber: updatedContactDetail.phoneNumber,
    DateSubmitted: dateFormatter.now().toDate()
  })
}
