const benefitValidator = require('../../../services/validators/eligibility/benefit-validator')
const UrlPathValidator = require('../../../services/validators/url-path-validator')

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
    var validationErrors = benefitValidator(req.body)

    if (validationErrors) {
      return res.status(400).render('first-time/new-eligibility/benefits', {
        errors: validationErrors,
        dob: dob,
        relationship: relationship
      })
    }

    if (benefit === 'none') {
      return res.redirect('/eligibility-fail')
    } else {
      return res.redirect(`/first-time/new-eligibility/${dob}/${relationship}/${benefit}`)
    }
  })
}
