const Expenses = require('../../../../services/domain/expenses/expenses')
const UrlPathValidator = require('../../../../services/validators/url-path-validator')
const expenseUrlRouter = require('../../../../services/routing/expenses-url-router')
const ValidationError = require('../../../../services/errors/validation-error')
const getClaimSummary = require('../../../../services/data/get-claim-summary')
const getIsAdvanceClaim = require('../../../../services/data/get-is-advance-claim')
const SessionValidator = require('../../../../services/validators/session-validator')
const NORTHERN_IRELAND = 'Northern Ireland'

module.exports = function (router) {
  router.get('/apply/eligibility/claim/expenses', function (req, res) {
    UrlPathValidator(req.params)
    var validatorResult = SessionValidator(req.session, req.url)

    console.dir(validatorResult)

    if (!validatorResult[0]) {
      return res.redirect(validatorResult[1])
    }

    getClaimSummary(req.session.claimId, req.session.claimType)
      .then(function (claimDetails) {
        getIsAdvanceClaim(req.session.claimId)
          .then(function (isAdvanceClaim) {
            var isNorthernIrelandClaim = claimDetails.claim.Country === NORTHERN_IRELAND

            return res.render('apply/eligibility/claim/expenses', {
              claimType: req.session.claimType,
              referenceId: req.session.referenceId,
              claimId: req.session.claimId,
              isNorthernIrelandClaim: isNorthernIrelandClaim,
              isAdvanceClaim: isAdvanceClaim
            })
          })
      })
  })

  router.post('/apply/eligibility/claim/expenses', function (req, res) {
    UrlPathValidator(req.params)
    var validatorResult = SessionValidator(req.session, req.url)

    console.dir(validatorResult)

    if (!validatorResult[0]) {
      return res.redirect(validatorResult[1])
    }

    try {
      new Expenses(req.body['expenses']) // eslint-disable-line no-new
      return res.redirect(expenseUrlRouter.getRedirectUrl(req))
    } catch (error) {
      if (error instanceof ValidationError) {
        getClaimSummary(req.session.claimId, req.session.claimType)
          .then(function (claimDetails) {
            getIsAdvanceClaim(req.session.claimId)
              .then(function (isAdvanceClaim) {
                var isNorthernIrelandClaim = claimDetails.claim.Country === NORTHERN_IRELAND

                return res.status(400).render('apply/eligibility/claim/expenses', {
                  errors: error.validationErrors,
                  claimType: req.session.claimType,
                  referenceId: req.session.referenceId,
                  claimId: req.session.claimId,
                  isNorthernIrelandClaim: isNorthernIrelandClaim,
                  isAdvanceClaim: isAdvanceClaim
                })
              })
          })
      } else {
        throw error
      }
    }
  })
}
