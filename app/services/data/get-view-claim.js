const getRepeatEligibility = require('./get-repeat-eligibility')
const getClaimExpenseByIdOrLastApproved = require('./get-claim-expense-by-id-or-last-approved')
const getClaimChildrenByIdOrLastApproved = require('./get-claim-children-by-id-or-last-approved')
const getHistoricClaimByClaimId = require('./get-historic-claim-by-claim-id')
const getClaimDocumentsHistoricClaim = require('./get-claim-documents-historic-claim')
const getAllClaimDocumentsByClaimId = require('./get-all-claim-documents-by-claim-id')
const getClaimEvents = require('./get-claim-events')
const sortViewClaimResults = require('../helpers/sort-view-claim-results-helper')
const Promise = require('bluebird')

module.exports = function (claimId, reference, dob) {
  return Promise.all([getHistoricClaimByClaimId(reference, dob, claimId),
    getRepeatEligibility(reference, dob, null),
    getClaimDocumentsHistoricClaim(reference, claimId),
    getClaimExpenseByIdOrLastApproved(reference, null, claimId),
    getAllClaimDocumentsByClaimId(claimId),
    getClaimEvents(reference, claimId),
    getClaimChildrenByIdOrLastApproved(reference, null, claimId)
    ])
    .then(function (results) {
      sortViewClaimResults(results)
      return {
        claim: results[0][0],
        claimExpenses: results[3],
        claimEvents: results[5],
        claimChild: results[6]
      }
    })
}
