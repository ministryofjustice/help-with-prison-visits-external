const prisonerRelationshipValidator = require('../../../services/validators/eligibility/prisoner-relationship-validator')
const UrlPathValidator = require('../../../services/validators/url-path-validator')

module.exports = function (router) {
  router.get('/first-time/:dob', function (req, res) {
    UrlPathValidator(req.params)
    return res.render('first-time/new-eligibility/prisoner-relationship', {
      dob: req.params.dob
    })
  })

  router.post('/first-time/:dob', function (req, res) {
    UrlPathValidator(req.params)

    var relationship = req.body.relationship
    var dob = req.params.dob
    var validationErrors = prisonerRelationshipValidator(req.body)

    if (validationErrors) {
      return res.status(400).render('first-time/new-eligibility/prisoner-relationship', {
        errors: validationErrors,
        dob: dob })
    }

    if (relationship === 'none') {
      return res.redirect('/eligibility-fail')
    } else {
      return res.redirect(`/first-time/${dob}/${relationship}`)
    }
  })
}
