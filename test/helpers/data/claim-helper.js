const config = require('../../../knexfile').migrations
const knex = require('knex')(config)
const claimChildHelper = require('./claim-child-helper')
const claimEscortHelper = require('./claim-escort-helper')
const expenseHelper = require('./expense-helper')
const claimDocumentHelper = require('./claim-document-helper')
const insertNewClaim = require('../../../app/services/data/insert-new-claim')
const NewClaim = require('../../../app/services/domain/new-claim')
const claimStatusEnum = require('../../../app/constants/claim-status-enum')
const dateFormatter = require('../../../app/services/date-formatter')
const moment = require('moment')

module.exports.CLAIM_TYPE = 'first-time'
module.exports.IS_ADVANCE_CLAIM = false
module.exports.DATE_OF_JOURNEY = moment().subtract(7, 'days').startOf('day')
module.exports.DATE_CREATED = dateFormatter.now()
module.exports.DATE_SUBMITTED = dateFormatter.now()
module.exports.STATUS = claimStatusEnum.IN_PROGRESS

const DAY = this.DATE_OF_JOURNEY.format('DD')
const MONTH = this.DATE_OF_JOURNEY.format('MM')
const YEAR = this.DATE_OF_JOURNEY.format('YYYY')

module.exports.build = function (reference) {
  return new NewClaim(reference, DAY, MONTH, YEAR, this.IS_ADVANCE_CLAIM)
}

module.exports.insert = function (reference, eligibilityId) {
  return insertNewClaim(reference, eligibilityId, this.CLAIM_TYPE, this.build(reference))
}

module.exports.insertWithExpenseChildDocuments = function (reference, eligibilityId) {
  var claimId
  return this.insert(reference, eligibilityId)
    .then(function (newClaimId) {
      claimId = newClaimId
      return expenseHelper.insert(reference, eligibilityId, claimId)
    })
    .then(function () {
      return claimChildHelper.insert(reference, eligibilityId, claimId)
    })
    .then(function () {
      return claimEscortHelper.insert(reference, eligibilityId, claimId)
    })
    .then(function () {
      return claimDocumentHelper.insert(reference, eligibilityId, claimId, claimDocumentHelper.DOCUMENT_TYPE)
        .then(function () {
          return claimDocumentHelper.insert(reference, eligibilityId, claimId, 'BENEFIT')
        })
    })
    .then(function () {
      return claimId
    })
}

module.exports.get = function (claimId) {
  return knex.first()
    .from('ExtSchema.Claim')
    .where('ClaimId', claimId)
}

module.exports.delete = function (claimId) {
  return knex('ExtSchema.Claim')
    .where('ClaimId', claimId)
    .del()
}
