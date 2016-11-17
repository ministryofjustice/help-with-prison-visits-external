const Benefits = require('../../../services/domain/benefits')
const UrlPathValidator = require('../../../services/validators/url-path-validator')
const ValidationError = require('../../../services/errors/validation-error')

module.exports = function (router) {
  router.get('/first-time/new-eligibility/:dob/:relationship', function (req, res) {
    UrlPathValidator(req.params)
    return res.render('first-time/new-eligibility/benefits', {
      dob: req.params.dob,
      relationship: req.params.relationship
    })
  })

  router.post('/first-time/new-eligibility/:dob/:relationship', function (req, res) {
    UrlPathValidator(req.params)

    var dob = req.params.dob
    var relationship = req.params.relationship
    var benefit = req.body.benefit

    try {
      var benefits = new Benefits(benefit)

      if (benefits.benefit === 'none') {
        return res.redirect('/eligibility-fail')
      } else {
        return res.redirect(`/first-time/new-eligibility/${dob}/${relationship}/${benefits.benefit}`)
      }
    } catch (error) {
      if (error instanceof ValidationError) {
        return res.status(400).render('first-time/new-eligibility/prisoner-relationship', {
          errors: error.validationErrors,
          dob: dob,
          relationship: relationship
        })
      } else {
        throw error
      }
    }
  })
}
