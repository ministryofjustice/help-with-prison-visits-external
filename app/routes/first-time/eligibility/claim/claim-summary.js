const UrlPathValidator = require('../../../../services/validators/url-path-validator')
const getClaimSummary = require('../../../../services/data/get-claim-summary')
const removeClaimExpense = require('../../../../services/data/remove-claim-expense')
const removeClaimDocument = require('../../../../services/data/remove-claim-document')
const dateHelper = require('../../../../views/helpers/date-helper')
const claimExpenseHelper = require('../../../../views/helpers/claim-expense-helper')
const benefitsEnum = require('../../../../constants/benefits-enum')

module.exports = function (router) {
  router.get('/first-time/eligibility/:referenceId/claim/:claimId/summary', function (req, res, next) {
    UrlPathValidator(req.params)

    getClaimSummary(req.params.claimId)
      .then(function (claimDetails) {
        return res.render('first-time/eligibility/claim/claim-summary',
          {
            referenceId: req.params.referenceId,
            claimId: req.params.claimId,
            claimDetails: claimDetails,
            dateHelper: dateHelper,
            claimExpenseHelper: claimExpenseHelper,
            benefitsEnum: benefitsEnum
          })
      })
      .catch(function (error) {
        next(error)
      })
  })

  router.post('/first-time/eligibility/:referenceId/claim/:claimId/summary', function (req, res) {
    UrlPathValidator(req.params)

    return res.redirect(`/first-time/eligibility/${req.params.referenceId}/claim/${req.params.claimId}/bank-account-details`)
  })

  router.post('/first-time/eligibility/:referenceId/claim/:claimId/summary/remove/:claimExpenseId', function (req, res, next) {
    UrlPathValidator(req.params)

    removeClaimExpense(req.params.claimId, req.params.claimExpenseId)
      .then(function () {
        return res.redirect(`/first-time/eligibility/${req.params.referenceId}/claim/${req.params.claimId}/summary`)
      })
      .catch(function (error) {
        next(error)
      })
  })

  router.post('/first-time/eligibility/:referenceId/claim/:claimId/summary/removeFile/', function (req, res, next) {
    UrlPathValidator(req.params)
    console.log(req.query)
    removeClaimDocument(req.params.claimId, req.query)
      .then(function () {
        return res.redirect(`/first-time/eligibility/${req.params.referenceId}/claim/${req.params.claimId}/summary`)
      })
      .catch(function (error) {
        next(error)
      })
  })
}
