const Expenses = require('../../../../services/domain/expenses/expenses')
const UrlPathValidator = require('../../../../services/validators/url-path-validator')
const expenseUrlRouter = require('../../../../services/routing/expenses-url-router')
const ValidationError = require('../../../../services/errors/validation-error')

module.exports = function (router) {
  router.get('/apply/:claimType/eligibility/:referenceId/claim/:claimId', function (req, res) {
    UrlPathValidator(req.params)

    return res.render('apply/eligibility/claim/expenses', {
      claimType: req.params.claimType,
      referenceId: req.params.referenceId,
      claimId: req.params.claimId
    })
  })

  router.post('/apply/:claimType/eligibility/:referenceId/claim/:claimId', function (req, res) {
    UrlPathValidator(req.params)

    try {
      new Expenses(req.body['expenses']) // eslint-disable-line no-new
      return res.redirect(expenseUrlRouter.getRedirectUrl(req))
    } catch (error) {
      if (error instanceof ValidationError) {
        return res.status(400).render('apply/eligibility/claim/expenses', {
          errors: error.validationErrors,
          claimType: req.params.claimType,
          referenceId: req.params.referenceId,
          claimId: req.params.claimId
        })
      } else {
        throw error
      }
    }
  })
}
