const { getDatabaseConnector } = require('../../../app/databaseConnector')
const eligiblityStatusEnum = require('../../../app/constants/eligibility-status-enum')
const visitorHelper = require('./visitor-helper')
const prisonerHelper = require('./prisoner-helper')
const claimHelper = require('./claim-helper')
const dateFormatter = require('../../../app/services/date-formatter')

module.exports.DATE_CREATED = dateFormatter.now()
module.exports.DATE_SUBMITTED = dateFormatter.now()
module.exports.STATUS = eligiblityStatusEnum.IN_PROGRESS

module.exports.insert = reference => {
  const db = getDatabaseConnector()

  return db('ExtSchema.Eligibility')
    .insert({
      Reference: reference,
      DateCreated: this.DATE_CREATED.toDate(),
      DateSubmitted: this.DATE_SUBMITTED.toDate(),
      Status: this.STATUS,
    })
    .returning('EligibilityId')
    .then(insertedIds => {
      return insertedIds[0].EligibilityId
    })
}

module.exports.insertEligibilityVisitorAndPrisoner = reference => {
  let eligibilityId

  return this.insert(reference)
    .then(newEligibilityId => {
      eligibilityId = newEligibilityId
      return visitorHelper.insert(reference, eligibilityId)
    })
    .then(() => {
      return prisonerHelper.insert(reference, eligibilityId)
    })
    .then(() => {
      return eligibilityId
    })
}

module.exports.insertEligibilityClaim = reference => {
  let eligibilityId

  return this.insert(reference)
    .then(newEligibilityId => {
      eligibilityId = newEligibilityId
      return claimHelper.insert(reference, newEligibilityId)
    })
    .then(newClaimId => {
      return { eligibilityId, claimId: newClaimId }
    })
}

module.exports.get = reference => {
  const db = getDatabaseConnector()

  return db.first().from('ExtSchema.Eligibility').where('Reference', reference)
}

module.exports.delete = reference => {
  return deleteByReference('ExtSchema.Eligibility', reference)
}

function deleteByReference(schemaTable, reference) {
  const db = getDatabaseConnector()

  return db(schemaTable).where('Reference', reference).del()
}

module.exports.deleteAll = reference => {
  return deleteByReference('ExtSchema.Task', reference)
    .then(() => {
      return deleteByReference('ExtSchema.EligibleChild', reference)
    })
    .then(() => {
      return deleteByReference('ExtSchema.ClaimBankDetail', reference)
    })
    .then(() => {
      return deleteByReference('ExtSchema.ClaimDocument', reference)
    })
    .then(() => {
      return deleteByReference('ExtSchema.ClaimExpense', reference)
    })
    .then(() => {
      return deleteByReference('ExtSchema.ClaimChild', reference)
    })
    .then(() => {
      return deleteByReference('ExtSchema.ClaimEscort', reference)
    })
    .then(() => {
      return deleteByReference('ExtSchema.Claim', reference)
    })
    .then(() => {
      return deleteByReference('ExtSchema.Visitor', reference)
    })
    .then(() => {
      return deleteByReference('ExtSchema.Prisoner', reference)
    })
    .then(() => {
      return deleteByReference('ExtSchema.Eligibility', reference)
    })
}
