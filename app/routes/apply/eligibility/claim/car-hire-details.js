const UrlPathValidator = require('../../../../services/validators/url-path-validator')
const referenceIdHelper = require('../../../helpers/reference-id-helper')
const ValidationError = require('../../../../services/errors/validation-error')
const expenseUrlRouter = require('../../../../services/routing/expenses-url-router')
const HireExpense = require('../../../../services/domain/expenses/hire-expense')
const insertExpense = require('../../../../services/data/insert-expense')
const getIsAdvanceClaim = require('../../../../services/data/get-is-advance-claim')
const SessionValidator = require('../../../../services/validators/session-validator')

module.exports = function (router) {
  router.get('/apply/eligibility/claim/hire', function (req, res) {
    UrlPathValidator(req.params)
    var validatorResult = SessionValidator(req.session, req.url)

    if (!validatorResult[0]) {
      return res.redirect(validatorResult[1])
    }

    getIsAdvanceClaim(req.session.claimId)
      .then(function (isAdvanceClaim) {
        return res.render('apply/eligibility/claim/car-hire-details', {
          claimType: req.session.claimType,
          referenceId: req.session.referenceId,
          claimId: req.session.claimId,
          params: expenseUrlRouter.parseParams(req.query),
          redirectUrl: expenseUrlRouter.getRedirectUrl(req),
          isAdvanceClaim: isAdvanceClaim
        })
      })
  })

  router.post('/apply/eligibility/claim/hire', function (req, res, next) {
    UrlPathValidator(req.params)
    var validatorResult = SessionValidator(req.session, req.url)

    if (!validatorResult[0]) {
      return res.redirect(validatorResult[1])
    }

    var referenceAndEligibilityId = referenceIdHelper.extractReferenceId(req.session.referenceId)

    try {
      var expense = new HireExpense(
        req.body.cost,
        req.body.from,
        req.body.to,
        req.body.duration
      )

      insertExpense(referenceAndEligibilityId.reference, referenceAndEligibilityId.id, req.session.claimId, expense)
        .then(function () {
          return res.redirect(expenseUrlRouter.getRedirectUrl(req))
        })
        .catch(function (error) {
          next(error)
        })
    } catch (error) {
      if (error instanceof ValidationError) {
        getIsAdvanceClaim(req.session.claimId)
          .then(function (isAdvanceClaim) {
            return res.status(400).render('apply/eligibility/claim/car-hire-details', {
              errors: error.validationErrors,
              claimType: req.session.claimType,
              referenceId: req.session.referenceId,
              claimId: req.session.claimId,
              params: expenseUrlRouter.parseParams(req.query),
              redirectUrl: expenseUrlRouter.getRedirectUrl(req),
              expense: req.body,
              isAdvanceClaim: isAdvanceClaim
            })
          })
      } else {
        throw error
      }
    }
  })
}
