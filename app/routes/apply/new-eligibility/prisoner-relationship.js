const prisonerRelationshipValidator = require('../../../services/validators/eligibility/prisoner-relationship-validator')
const UrlPathValidator = require('../../../services/validators/url-path-validator')

module.exports = function (router) {
  router.get('/apply/:claimType/new-eligibility/:dob', function (req, res) {
    UrlPathValidator(req.params)
    return res.render('apply/new-eligibility/prisoner-relationship', {
      claimType: req.params.claimType,
      dob: req.params.dob
    })
  })

  router.post('/apply/:claimType/new-eligibility/:dob', function (req, res) {
    UrlPathValidator(req.params)

    var relationship = req.body.relationship
    var dob = req.params.dob
    var validationErrors = prisonerRelationshipValidator(req.body)

    if (validationErrors) {
      return res.status(400).render('apply/new-eligibility/prisoner-relationship', {
        errors: validationErrors,
        claimType: req.params.claimType,
        dob: dob
      })
    }

    if (relationship === 'none') {
      return res.redirect('/eligibility-fail')
    } else {
      return res.redirect(`/apply/${req.params.claimType}/new-eligibility/${dob}/${relationship}`)
    }
  })
}
