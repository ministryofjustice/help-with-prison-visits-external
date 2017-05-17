const UrlPathValidator = require('../../../../services/validators/url-path-validator')
const HasChild = require('../../../../services/domain/has-child')
const ValidationError = require('../../../../services/errors/validation-error')
const SessionHandler = require('../../../../services/validators/session-handler')

module.exports = function (router) {
  router.get('/apply/eligibility/claim/has-child', function (req, res) {
    UrlPathValidator(req.params)
    var isValidSession = SessionHandler(req.session, req.url)

    if (!isValidSession) {
      return res.redirect(SessionHandler.getErrorPath(req.session, req.url))
    }

    return res.render('apply/eligibility/claim/has-child', {
      claimType: req.session.claimType,
      referenceId: req.session.referenceId,
      claimId: req.session.claimId
    })
  })

  router.post('/apply/eligibility/claim/has-child', function (req, res) {
    UrlPathValidator(req.params)
    var isValidSession = SessionHandler(req.session, req.url)

    if (!isValidSession) {
      return res.redirect(SessionHandler.getErrorPath(req.session, req.url))
    }

    try {
      var hasChild = new HasChild(req.body['has-child'])
      if (hasChild.hasChild === 'yes') {
        return res.redirect(`/apply/eligibility/claim/about-child`)
      } else {
        return res.redirect(`/apply/eligibility/claim/expenses`)
      }
    } catch (error) {
      if (error instanceof ValidationError) {
        return res.status(400).render('apply/eligibility/claim/has-child', {
          errors: error.validationErrors,
          claimType: req.session.claimType,
          referenceId: req.session.referenceId,
          claimId: req.session.claimId
        })
      } else {
        throw error
      }
    }
  })
}
