const benefitValidator = require('../../services/validators/eligibility/benefit-validator')
const UrlPathValidator = require('../../services/validators/url-path-validator')

module.exports = function (router) {
  router.get('/first-time/:dob/:relationship/:assistance', function (req, res) {
    UrlPathValidator(req.params)
    return res.render('first-time/benefits', {
      dob: req.params.dob,
      relationship: req.params.relationship,
      assistance: req.params.assistance
    })
  })

  router.post('/first-time/:dob/:relationship/:assistance', function (req, res) {
    UrlPathValidator(req.params)

    var dob = req.params.dob
    var relationship = req.params.relationship
    var assistance = req.params.assistance
    var benefit = req.body.benefit
    var validationErrors = benefitValidator(req.body)

    if (validationErrors) {
      return res.status(400).render('first-time/benefits', {
        errors: validationErrors,
        dob: dob,
        relationship: relationship,
        assistance: assistance
      })
    }

    if (benefit === 'none') {
      return res.redirect('/eligibility-fail')
    } else {
      return res.redirect(`/first-time/${dob}/${relationship}/${assistance}/${benefit}`)
    }
  })
}
