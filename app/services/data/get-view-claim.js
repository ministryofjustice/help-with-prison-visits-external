const getRepeatEligibility = require('./get-repeat-eligibility')
const getClaimExpenseByIdOrLastApproved = require('./get-claim-expense-by-id-or-last-approved')
const getClaimChildrenByIdOrLastApproved = require('./get-claim-children-by-id-or-last-approved')
const getHistoricClaimByClaimId = require('./get-historic-claim-by-claim-id')
const getClaimDocumentsHistoricClaim = require('./get-claim-documents-historic-claim')
const getAllClaimDocumentsByClaimId = require('./get-all-claim-documents-by-claim-id')
const getClaimEvents = require('./get-claim-events')
const sortViewClaimResults = require('../helpers/sort-view-claim-results-helper')
const maskString = require('../helpers/mask-string')
const Promise = require('bluebird')

module.exports = function (claimId, reference, dob) {
  return getHistoricClaimByClaimId(reference, dob, claimId)
    .then(function (historicClaim) {
      const claim = historicClaim[0]
      return Promise.all([getRepeatEligibility(reference, dob, null),
        getClaimDocumentsHistoricClaim(reference, claim.EligibilityId, claimId),
        getClaimExpenseByIdOrLastApproved(reference, null, claimId),
        getAllClaimDocumentsByClaimId(claimId, reference, claim.EligibilityId),
        getClaimEvents(reference, claimId),
        getClaimChildrenByIdOrLastApproved(reference, null, claimId)
      ])
        .then(function (results) {
          const eligibility = results[0]
          const claimDocuments = results[1]
          const claimExpenses = results[2]
          const externalClaimDocuments = results[3]
          const claimEvents = results[4]
          const claimChild = results[5].map(function (claimChild) {
            claimChild.LastName = maskString(claimChild.LastName, 1)
            return claimChild
          })
          sortViewClaimResults(claim, eligibility, claimDocuments, claimExpenses, externalClaimDocuments)
          return {
            claim: claim,
            claimExpenses: claimExpenses,
            claimEvents: claimEvents,
            claimChild: claimChild
          }
        })
    })
}
