const Benefits = require('../../../services/domain/benefits')
const UrlPathValidator = require('../../../services/validators/url-path-validator')
const ValidationError = require('../../../services/errors/validation-error')
const claimTypeEnum = require('../../../constants/claim-type-enum')

module.exports = function (router) {
  router.get('/apply/:claimType/new-eligibility/:dob/:relationship', function (req, res) {
    UrlPathValidator(req.params)
    return res.render('apply/new-eligibility/benefits', {
      URL: req.url
    })
  })

  router.post('/apply/:claimType/new-eligibility/:dob/:relationship', function (req, res) {
    UrlPathValidator(req.params)

    var dob = req.params.dob
    var relationship = req.params.relationship
    var benefit = req.body.benefit

    try {
      var benefits = new Benefits(benefit)

      if (benefits.benefit === 'none') {
        return res.redirect('/eligibility-fail')
      } else {
        var params = ''
        if (req.params.claimType === claimTypeEnum.REPEAT_NEW_ELIGIBILITY) {
          params = `?reference=${req.query.reference}&prisoner-number=${req.query['prisoner-number']}`
        }
        return res.redirect(`/apply/${req.params.claimType}/new-eligibility/${dob}/${relationship}/${benefits.benefit}${params}`)
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
