const DateOfBirth = require('../../../services/domain/date-of-birth')
const UrlPathValidator = require('../../../services/validators/url-path-validator')
const ValidationError = require('../../../services/errors/validation-error')
const ERROR_MESSAGES = require('../../../services/validators/validation-error-messages')
const claimTypeEnum = require('../../../constants/claim-type-enum')

module.exports = function (router) {
  router.get('/apply/:claimType/new-eligibility', function (req, res) {
    UrlPathValidator(req.params)
    var errors

    req.session.claimType = claimTypeEnum.FIRST_TIME
    var claimType = req.session.claimType

    if ((req.query.error === 'expired')) {
      errors = { expired: [ ERROR_MESSAGES.getExpiredSessionDOB ] }
    }

    return res.render('apply/new-eligibility/date-of-birth', {
      errors: errors,
      recovery: req.query.recovery,
      claimType: claimType
    })
  })

  router.post('/apply/:claimType/new-eligibility', function (req, res) {
    UrlPathValidator(req.params)

    req.session.claimType = claimTypeEnum.FIRST_TIME
    var claimType = req.session.claimType

    try {
      var dateOfBirth = new DateOfBirth(
        req.body['dob-day'],
        req.body['dob-month'],
        req.body['dob-year']
      )

      req.session.dobEncoded = dateOfBirth.encodedDate
      var dobEncoded = req.session.dobEncoded

      return res.redirect(`/apply/${claimType}/new-eligibility/${dobEncoded}`)
    } catch (error) {
      if (error instanceof ValidationError) {
        return res.status(400).render('apply/new-eligibility/date-of-birth', {
          errors: error.validationErrors,
          claimType: req.session.claimType,
          claimant: req.body
        })
      } else {
        throw error
      }
    }
  })
}
