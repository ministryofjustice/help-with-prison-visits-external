const UrlPathValidator = require('../../../../services/validators/url-path-validator')
const getIndividualClaimDetails = require('../../../../services/data/get-individual-claim-details')
const removeClaimExpense = require('../../../../services/data/remove-claim-expense')
const dateHelper = require('../../../../views/helpers/date-helper')
const claimExpenseHelper = require('../../../../views/helpers/claim-expense-helper')
const benefitsEnum = require('../../../../constants/benefits-enum')

module.exports = function (router) {
  router.get('/first-time/eligibility/:reference/claim/:claimId/summary', function (req, res) {
    UrlPathValidator(req.params)

    getIndividualClaimDetails(req.params.claimId)
      .then(function (claimDetails) {
        return res.render('first-time/eligibility/claim/claim-summary',
          {
            reference: req.params.reference,
            claimId: req.params.claimId,
            claimDetails: claimDetails,
            dateHelper: dateHelper,
            claimExpenseHelper: claimExpenseHelper,
            benefitsEnum: benefitsEnum
          })
      })
  })

  router.post('/first-time/eligibility/:reference/claim/:claimId/summary', function (req, res) {
    UrlPathValidator(req.params)
    return res.redirect(`/first-time/eligibility/${req.params.reference}/claim/${req.params.claimId}/bank-account-details`)
  })

  router.post('/first-time/eligibility/:reference/claim/:claimId/summary/remove/:claimExpenseId', function (req, res) {
    UrlPathValidator(req.params)

    removeClaimExpense(req.params.claimId, req.params.claimExpenseId)
      .then(function () {
        return res.redirect(`/first-time/eligibility/${req.params.reference}/claim/${req.params.claimId}/summary`)
      })
  })
}
