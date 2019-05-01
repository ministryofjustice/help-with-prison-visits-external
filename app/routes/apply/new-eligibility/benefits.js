const Benefits = require('../../../services/domain/benefits')
const UrlPathValidator = require('../../../services/validators/url-path-validator')
const SessionHandler = require('../../../services/validators/session-handler')
const ValidationError = require('../../../services/errors/validation-error')
const log = require('../../../services/log')

module.exports = function (router) {
  router.get('/apply/:claimType/new-eligibility/benefits', function (req, res) {
    UrlPathValidator(req.params)
    var isValidSession = SessionHandler.validateSession(req.session, req.url)

    if (!isValidSession) {
      return res.redirect(SessionHandler.getErrorPath(req.session, req.url))
    }

    return res.render('apply/new-eligibility/benefits', {
      URL: req.url
    })
  })

  router.post('/apply/:claimType/new-eligibility/benefits', function (req, res) {
    UrlPathValidator(req.params)
    var isValidSession = SessionHandler.validateSession(req.session, req.url)

    if (!isValidSession) {
      return res.redirect(SessionHandler.getErrorPath(req.session, req.url))
    }

    try {
      var benefits = new Benefits(req.body.benefit, req.body.benefitAbout)

      var benefit = benefits.benefit
      req.session.benefit = req.body.benefit
      req.session.benefitAbout = req.body.benefitAbout

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
