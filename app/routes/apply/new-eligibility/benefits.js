const Benefits = require('../../../services/domain/benefits')
const UrlPathValidator = require('../../../services/validators/url-path-validator')
const SessionValidator = require('../../../services/validators/session-validator')
const ValidationError = require('../../../services/errors/validation-error')

module.exports = function (router) {
  router.get('/apply/:claimType/new-eligibility/benefits', function (req, res) {
    UrlPathValidator(req.params)
    var validatorResult = SessionValidator(req.session, req.url)

    if (!validatorResult[0]) {
      return res.redirect(validatorResult[1])
    }

    return res.render('apply/new-eligibility/benefits', {
      URL: req.url
    })
  })

  router.post('/apply/:claimType/new-eligibility/benefits', function (req, res) {
    UrlPathValidator(req.params)
    var validatorResult = SessionValidator(req.session, req.url)

    if (!validatorResult[0]) {
      return res.redirect(validatorResult[1])
    }

    try {
      var benefits = new Benefits(req.body.benefit)

      var benefit = benefits.benefit
      req.session.benefit = req.body.benefit

      if (benefit === 'none') {
        return res.redirect('/eligibility-fail')
      } else {
        return res.redirect(`/apply/${req.params.claimType}/new-eligibility/about-the-prisoner`)
      }
    } catch (error) {
      if (error instanceof ValidationError) {
        return res.status(400).render('apply/new-eligibility/benefits', {
          errors: error.validationErrors,
          URL: req.url
        })
      } else {
        throw error
      }
    }
  })
}
