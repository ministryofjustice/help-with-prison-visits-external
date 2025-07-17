const { getDatabaseConnector } = require('../../../../app/databaseConnector')
const claimHelper = require('./internal-claim-helper')
const claimChildHelper = require('./internal-claim-child-helper')
const claimExpenseHelper = require('./internal-claim-expense-helper')
const claimEventHelper = require('./internal-claim-event-helper')
const visitorHelper = require('./internal-visitor-helper')
const prisonerHelper = require('./internal-prisoner-helper')
const claimDocumentHelper = require('./internal-claim-document-helper')
const dateFormatter = require('../../../../app/services/date-formatter')

module.exports.ELIGIBILITY_ID = Math.floor(Date.now() / 100) - 15000000000
module.exports.DATE_CREATED = dateFormatter.now()
module.exports.DATE_SUBMITTED = dateFormatter.now()
module.exports.STATUS = 'APPROVED'

module.exports.insert = reference => {
  const db = getDatabaseConnector()

  return db('IntSchema.Eligibility')
    .insert({
      EligibilityId: this.ELIGIBILITY_ID,
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

module.exports.insertEligibilityAndClaim = (reference, status) => {
  let eligibilityId
  let claimId

  return this.insert(reference)
    .then(id => {
      eligibilityId = id
    })
    .then(() => {
      return visitorHelper.insert(reference, eligibilityId)
    })
    .then(() => {
      return prisonerHelper.insert(reference, eligibilityId)
    })
    .then(() => {
      return claimHelper.insert(reference, eligibilityId, undefined, status)
    })
    .then(newClaimId => {
      claimId = newClaimId
    })
    .then(() => {
      return claimChildHelper.insert(reference, eligibilityId, claimId)
    })
    .then(() => {
      return claimExpenseHelper.insert(reference, eligibilityId, claimId)
    })
    .then(() => {
      return claimDocumentHelper.insert(
        reference,
        eligibilityId,
        claimId,
        undefined,
        claimExpenseHelper.CLAIM_EXPENSE_ID,
      )
    })
    .then(() => {
      return claimEventHelper.insert(reference, eligibilityId, claimId)
    })
    .then(() => {
      return { eligibilityId, claimId }
    })
}

module.exports.get = reference => {
  const db = getDatabaseConnector()

  return db.first().from('IntSchema.Eligibility').where('Reference', reference)
}

module.exports.delete = reference => {
  return deleteByReference('IntSchema.Eligibility', reference)
}

function deleteByReference(schemaTable, reference) {
  const db = getDatabaseConnector()

  return db(schemaTable).where('Reference', reference).del()
}

/**
 * Deletes all records with the given reference across all schemas.
 */
module.exports.deleteAll = reference => {
  const self = this
  return self.deleteAllExternal(reference).then(() => {
    return self.deleteAllInternal(reference)
  })
}

/**
 * Deletes all records with the given reference in the External schema.
 */
module.exports.deleteAllExternal = reference => {
  return deleteByReference('ExtSchema.Task', reference)
    .then(() => {
      return deleteByReference('ExtSchema.ClaimDocument', reference)
    })
    .then(() => {
      return deleteByReference('ExtSchema.ClaimBankDetail', reference)
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
      return deleteByReference('ExtSchema.Benefit', reference)
    })
    .then(() => {
      return deleteByReference('ExtSchema.EligibilityVisitorUpdateContactDetail', reference)
    })
    .then(() => {
      return deleteByReference('ExtSchema.Eligibility', reference)
    })
}

/**
 * Deletes all records with the given reference in the Internal schema.
 * Excludes the DirectPaymentFile and AutoApprovalConfig tables.
 */
module.exports.deleteAllInternal = reference => {
  return deleteByReference('IntSchema.Task', reference)
    .then(() => {
      return deleteByReference('IntSchema.ClaimEvent', reference)
    })
    .then(() => {
      return deleteByReference('IntSchema.ClaimDocument', reference)
    })
    .then(() => {
      return deleteByReference('IntSchema.ClaimBankDetail', reference)
    })
    .then(() => {
      return deleteByReference('IntSchema.ClaimDeduction', reference)
    })
    .then(() => {
      return deleteByReference('IntSchema.ClaimExpense', reference)
    })
    .then(() => {
      return deleteByReference('IntSchema.ClaimChild', reference)
    })
    .then(() => {
      return deleteByReference('IntSchema.ClaimEscort', reference)
    })
    .then(() => {
      return deleteByReference('IntSchema.Claim', reference)
    })
    .then(() => {
      return deleteByReference('IntSchema.Visitor', reference)
    })
    .then(() => {
      return deleteByReference('IntSchema.Prisoner', reference)
    })
    .then(() => {
      return deleteByReference('IntSchema.Benefit', reference)
    })
    .then(() => {
      return deleteByReference('IntSchema.Eligibility', reference)
    })
}
