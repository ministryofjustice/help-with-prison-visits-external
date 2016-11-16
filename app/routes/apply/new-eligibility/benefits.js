const benefitValidator = require('../../../services/validators/eligibility/benefit-validator')
const UrlPathValidator = require('../../../services/validators/url-path-validator')

module.exports = function (router) {
  router.get('/apply/:claimType/new-eligibility/:dob/:relationship', function (req, res) {
    UrlPathValidator(req.params)
    return res.render('apply/new-eligibility/benefits', {
      claimType: req.params.claimType,
      dob: req.params.dob,
      relationship: req.params.relationship
    })
  })

  router.post('/apply/:claimType/new-eligibility/:dob/:relationship', function (req, res) {
    UrlPathValidator(req.params)

    var dob = req.params.dob
    var relationship = req.params.relationship
    var benefit = req.body.benefit
    var validationErrors = benefitValidator(req.body)

    if (validationErrors) {
      return res.status(400).render('apply/new-eligibility/benefits', {
        errors: validationErrors,
        claimType: req.params.claimType,
        dob: dob,
        relationship: relationship
      })
    }

    if (benefit === 'none') {
      return res.redirect('/eligibility-fail')
    } else {
      return res.redirect(`/apply/${req.params.claimType}/new-eligibility/${dob}/${relationship}/${benefit}`)
    }
  })
}
