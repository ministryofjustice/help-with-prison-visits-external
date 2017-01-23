const removeClaimExpense = require('../../services/data/remove-claim-expense')
const removeClaimDocument = require('../../services/data/remove-claim-document')

// TODO: Unit test these functions.

module.exports.removeExpense = function (claimId, claimExpenseId) {
  return removeClaimExpense(claimId, claimExpenseId)
}

module.exports.removeDocument = function (claimDocumentId) {
  return removeClaimDocument(claimDocumentId)
}

module.exports.removeExpenseAndDocument = function (claimId, claimExpenseId, claimDocumentId) {
  var self = this
  return self.removeExpense(claimId, claimExpenseId)
    .then(function () { return self.removeDocument(claimDocumentId) })
}
