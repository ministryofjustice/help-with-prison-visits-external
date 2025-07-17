const { getDatabaseConnector } = require('../../../app/databaseConnector')
const insertEligibilityVisitorUpdatedContactDetail = require('../../../app/services/data/insert-eligibility-visitor-updated-contact-detail')
const UpdateContactDetails = require('../../../app/services/domain/updated-contact-details')

module.exports.EMAIL_ADDRESS = 'donotsend@apvs.com'
module.exports.PHONE_NUMBER = '02153245564'

module.exports.build = () => {
  return new UpdateContactDetails(this.EMAIL_ADDRESS, this.PHONE_NUMBER)
}

module.exports.insert = (reference, eligibilityId) => {
  return insertEligibilityVisitorUpdatedContactDetail(reference, eligibilityId, this.build())
}

module.exports.get = reference => {
  const db = getDatabaseConnector()

  return db.first().from('ExtSchema.EligibilityVisitorUpdateContactDetail').where('Reference', reference)
}

module.exports.delete = reference => {
  const db = getDatabaseConnector()

  return db('ExtSchema.EligibilityVisitorUpdateContactDetail').where('Reference', reference).del()
}
