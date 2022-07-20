const DateOfBirth = require('../../../services/domain/date-of-birth')
const UrlPathValidator = require('../../../services/validators/url-path-validator')
const ValidationError = require('../../../services/errors/validation-error')
const ERROR_MESSAGES = require('../../../services/validators/validation-error-messages')
const SessionHandler = require('../../../services/validators/session-handler')

module.exports = function (router) {
  router.get('/apply/:claimType/new-eligibility/date-of-birth', function (req, res) {
    UrlPathValidator(req.params)
    let errors

    if (req.params.claimType === 'first-time') {
      req.session = SessionHandler.clearSession(req.session, req.url)
    }

    if ((req.query.error === 'expired')) {
      errors = { expired: [ERROR_MESSAGES.getExpiredSessionDOB] }
    }

    return res.render('apply/new-eligibility/date-of-birth', {
      errors,
      recovery: req.query.recovery,
      claimType: req.params.claimType
    })
  })

  router.post('/apply/:claimType/new-eligibility/date-of-birth', function (req, res, next) {
    UrlPathValidator(req.params)

    try {
      const dateOfBirth = new DateOfBirth(
        req.body['dob-day'],
        req.body['dob-month'],
        req.body['dob-year']
      )

      req.session.dobEncoded = dateOfBirth.encodedDate

      return res.redirect(`/apply/${req.params.claimType}/new-eligibility/prisoner-relationship`)
    } catch (error) {
      if (error instanceof ValidationError) {
        return res.status(400).render('apply/new-eligibility/date-of-birth', {
          errors: error.validationErrors,
          claimType: req.params.claimType,
          claimant: req.body
        })
      } else {
        throw error
      }
    }
  })
}
