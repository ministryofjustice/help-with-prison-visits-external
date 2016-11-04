const firstTimeClaim = require('../../../services/data/first-time-claim')
const validator = require('../../../services/validators/first-time/about-the-prisoner-validator')
const UrlPathValidator = require('../../../services/validators/url-path-validator')

module.exports = function (router) {
  router.get('/first-time/:dob/:relationship/:benefit', function (req, res) {
    UrlPathValidator(req.params)
    return res.render('first-time/new-eligibility/about-the-prisoner', {
      dob: req.params.dob,
      relationship: req.params.relationship,
      benefit: req.params.benefit
    })
  })

  router.post('/first-time/:dob/:relationship/:benefit', function (req, res) {
    UrlPathValidator(req.params)

    var validationErrors = validator(req.body)
    var dob = req.params.dob
    var relationship = req.params.relationship
    var benefit = req.params.benefit
    var prisoner = req.body

    if (validationErrors) {
      return res.status(400).render('first-time/new-eligibility/about-the-prisoner', {
        dob: dob,
        relationship: relationship,
        benefit: benefit,
        prisoner: prisoner,
        errors: validationErrors
      })
    }

    firstTimeClaim.insertNewEligibilityAndPrisoner(prisoner)
      .then(function (newReference) {
        return res.redirect(`/first-time/${dob}/${relationship}/${benefit}/${newReference}`)
      })
  })
}
