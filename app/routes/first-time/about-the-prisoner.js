const firstTimeClaim = require('../../services/data/first-time-claim')
const validator = require('../../services/validators/first-time/about-the-prisoner-validator')
const UrlPathValidator = require('../../services/validators/url-path-validator')

module.exports = function (router) {
  router.get('/first-time/:dob/:relationship/:requireBenefitUpload', function (req, res) {
    UrlPathValidator(req.params)
    return res.render('first-time/about-the-prisoner', {
      dob: req.params.dob,
      relationship: req.params.relationship,
      requireBenefitUpload: req.params.requireBenefitUpload
    })
  })

  router.post('/first-time/:dob/:relationship/:requireBenefitUpload', function (req, res) {
    UrlPathValidator(req.params)

    var validationErrors = validator(req.body)
    var dob = req.params.dob
    var relationship = req.params.relationship
    var requireBenefitUpload = req.params.requireBenefitUpload
    var prisoner = req.body

    if (validationErrors) {
      return res.status(400).render('first-time/about-the-prisoner', {
        dob: dob,
        relationship: relationship,
        requireBenefitUpload: requireBenefitUpload,
        prisoner: prisoner,
        errors: validationErrors
      })
    }

    firstTimeClaim.insertNewEligibilityAndPrisoner(prisoner)
      .then(function (newReference) {
        return res.redirect(`/first-time/${dob}/${relationship}/${requireBenefitUpload}/${newReference}`)
      })
  })
}
