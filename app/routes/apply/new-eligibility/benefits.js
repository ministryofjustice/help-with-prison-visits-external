const Benefits = require('../../../services/domain/benefits')
const UrlPathValidator = require('../../../services/validators/url-path-validator')
const ValidationError = require('../../../services/errors/validation-error')
const claimTypeEnum = require('../../../constants/claim-type-enum')

const REFERENCE_DOB_ERROR = '?error=expired'

module.exports = function (router) {
  router.get('/apply/:claimType/new-eligibility/:dob/:relationship', function (req, res) {
    UrlPathValidator(req.params)

    if (!req.session ||
        !req.session.claimType ||
        !req.session.dobEncoded ||
        !req.session.relationship) {
      return res.redirect(`/apply/first-time/new-eligibility${REFERENCE_DOB_ERROR}`)
    }

    return res.render('apply/new-eligibility/benefits', {
      URL: req.url
    })
  })

  router.post('/apply/:claimType/new-eligibility/:dob/:relationship', function (req, res) {
    UrlPathValidator(req.params)

    if (!req.session ||
        !req.session.claimType ||
        !req.session.dobEncoded ||
        !req.session.relationship) {
      return res.redirect(`/apply/first-time/new-eligibility${REFERENCE_DOB_ERROR}`)
    }

    var claimType = req.session.claimType
    var dobEncoded = req.session.dobEncoded
    var relationship = req.session.relationship

    try {
      var benefits = new Benefits(req.body.benefit)

      var benefit = benefits.benefit
      req.session.benefit = req.body.benefit

      if (benefit === 'none') {
        return res.redirect('/eligibility-fail')
      } else {
        var params = ''
        if (claimType === claimTypeEnum.REPEAT_NEW_ELIGIBILITY) {
          var referenceId = req.query.reference
          var prisonerNumber = req.query['prisoner-number']

          params = `?reference=${referenceId}&prisoner-number=${prisonerNumber}`
        }
        return res.redirect(`/apply/${claimType}/new-eligibility/${dobEncoded}/${relationship}/${benefit}${params}`)
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
