const PrisonerRelationship = require('../../../services/domain/prisoner-relationship')
const UrlPathValidator = require('../../../services/validators/url-path-validator')
const ValidationError = require('../../../services/errors/validation-error')
const claimTypeEnum = require('../../../constants/claim-type-enum')
const prisonerRelationshipEnum = require('../../../constants/prisoner-relationships-enum')

const REFERENCE_DOB_ERROR = '?error=expired'

module.exports = function (router) {
  router.get('/apply/:claimType/new-eligibility/:dob', function (req, res) {
    UrlPathValidator(req.params)

    if (!req.session ||
        !req.session.claimType ||
        !req.session.dobEncoded) {
      return res.redirect(`/apply/first-time/new-eligibility${REFERENCE_DOB_ERROR}`)
    }

    return res.render('apply/new-eligibility/prisoner-relationship', {
      URL: req.url
    })
  })

  router.post('/apply/:claimType/new-eligibility/:dob', function (req, res) {
    UrlPathValidator(req.params)

    if (!req.session ||
        !req.session.claimType ||
        !req.session.dobEncoded) {
      return res.redirect(`/apply/first-time/new-eligibility${REFERENCE_DOB_ERROR}`)
    }

    var claimType = req.session.claimType
    var dobEncoded = req.session.dobEncoded

    try {
      var prisonerRelationship = new PrisonerRelationship(req.body.relationship)

      var relationship = prisonerRelationship.relationship
      req.session.relationship = relationship

      if (relationship === prisonerRelationshipEnum.NONE.urlValue) {
        return res.redirect('/eligibility-fail')
      } else {
        var params = ''
        if (claimType === claimTypeEnum.REPEAT_NEW_ELIGIBILITY) {
          params = `?reference=${req.query.reference}&prisoner-number=${req.query['prisoner-number']}`
        }
        return res.redirect(`/apply/${claimType}/new-eligibility/${dobEncoded}/${relationship}${params}`)
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
