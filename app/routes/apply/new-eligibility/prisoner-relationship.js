const PrisonerRelationship = require('../../../services/domain/prisoner-relationship')
const UrlPathValidator = require('../../../services/validators/url-path-validator')
const ValidationError = require('../../../services/errors/validation-error')
const claimTypeEnum = require('../../../constants/claim-type-enum')

module.exports = function (router) {
  router.get('/apply/:claimType/new-eligibility/:dob', function (req, res) {
    UrlPathValidator(req.params)
    return res.render('apply/new-eligibility/prisoner-relationship', {
      URL: req.url
    })
  })

  router.post('/apply/:claimType/new-eligibility/:dob', function (req, res) {
    UrlPathValidator(req.params)

    var relationship = req.body.relationship
    var dob = req.params.dob

    try {
      var prisonerRelationship = new PrisonerRelationship(relationship)

      if (prisonerRelationship.relationship === 'none') {
        return res.redirect('/eligibility-fail')
      } else {
        var params = ''
        if (req.params.claimType === claimTypeEnum.REPEAT_NEW_ELIGIBILITY) {
          params = `?reference=${req.query.reference}&prisoner-number=${req.query['prisoner-number']}`
        }
        return res.redirect(`/apply/${req.params.claimType}/new-eligibility/${dob}/${prisonerRelationship.relationship}${params}`)
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
