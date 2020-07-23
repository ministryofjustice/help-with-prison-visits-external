const Benefits = require('../../../services/domain/benefits')
const UrlPathValidator = require('../../../services/validators/url-path-validator')
const SessionHandler = require('../../../services/validators/session-handler')
const ValidationError = require('../../../services/errors/validation-error')
const prisonerRelationshipEnum = require('../../../constants/prisoner-relationships-enum')

module.exports = function (router) {
  router.get('/apply/:claimType/new-eligibility/benefits', function (req, res) {
    UrlPathValidator(req.params)
    var isValidSession = SessionHandler.validateSession(req.session, req.url)

    if (!isValidSession) {
      return res.redirect(SessionHandler.getErrorPath(req.session, req.url))
    }

    var relationships = Object.keys(prisonerRelationshipEnum)
    var relationship
    for (var r of relationships) {
      if (prisonerRelationshipEnum[r].urlValue === req.session.relationship) {
        relationship = prisonerRelationshipEnum[r].value
      }
    }
    return res.render('apply/new-eligibility/benefits', {
      URL: req.url,
      relationship: relationship
    })
  })

  router.post('/apply/:claimType/new-eligibility/benefits', function (req, res) {
    UrlPathValidator(req.params)
    var isValidSession = SessionHandler.validateSession(req.session, req.url)

    if (!isValidSession) {
      return res.redirect(SessionHandler.getErrorPath(req.session, req.url))
    }

    var relationships = Object.keys(prisonerRelationshipEnum)
    var relationship
    for (var r of relationships) {
      if (prisonerRelationshipEnum[r].urlValue === req.session.relationship) {
        relationship = prisonerRelationshipEnum[r].value
      }
    }

    try {
      var benefits = new Benefits(req.body.benefit, req.body.benefitOwner)

      var benefit = benefits.benefit
      req.session.benefit = req.body.benefit
      req.session.benefitOwner = req.body.benefitOwner

      if (benefit === 'none') {
        return res.redirect('/eligibility-fail')
      } else {
        return res.redirect(`/apply/${req.params.claimType}/new-eligibility/about-the-prisoner`)
      }
    } catch (error) {
      if (error instanceof ValidationError) {
        return res.status(400).render('apply/new-eligibility/benefits', {
          errors: error.validationErrors,
          URL: req.url,
          relationship: relationship
        })
      } else {
        throw error
      }
    }
  })
}
