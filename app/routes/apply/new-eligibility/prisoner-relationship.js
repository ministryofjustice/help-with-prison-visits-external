const PrisonerRelationship = require('../../../services/domain/prisoner-relationship')
const UrlPathValidator = require('../../../services/validators/url-path-validator')
const ValidationError = require('../../../services/errors/validation-error')
const prisonerRelationshipEnum = require('../../../constants/prisoner-relationships-enum')
const SessionHandler = require('../../../services/validators/session-handler')

module.exports = function (router) {
  router.get('/apply/:claimType/new-eligibility/prisoner-relationship', function (req, res) {
    UrlPathValidator(req.params)
    const isValidSession = SessionHandler.validateSession(req.session, req.url)

    if (!isValidSession) {
      return res.redirect(SessionHandler.getErrorPath(req.session, req.url))
    }

    return res.render('apply/new-eligibility/prisoner-relationship', {
      URL: req.url
    })
  })

  router.post('/apply/:claimType/new-eligibility/prisoner-relationship', function (req, res) {
    UrlPathValidator(req.params)
    const isValidSession = SessionHandler.validateSession(req.session, req.url)

    if (!isValidSession) {
      return res.redirect(SessionHandler.getErrorPath(req.session, req.url))
    }

    try {
      const prisonerRelationship = new PrisonerRelationship(req.body?.relationship)

      const relationship = prisonerRelationship.relationship
      req.session.relationship = relationship

      if (relationship === prisonerRelationshipEnum.NONE.urlValue) {
        return res.redirect('/eligibility-fail')
      } else {
        return res.redirect(`/apply/${req.params.claimType}/new-eligibility/benefits`)
      }
    } catch (error) {
      if (error instanceof ValidationError) {
        return res.status(400).render('apply/new-eligibility/prisoner-relationship', {
          errors: error.validationErrors,
          URL: req.url
        })
      } else {
        throw error
      }
    }
  })
}
