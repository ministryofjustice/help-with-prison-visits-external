const firstTimeClaim = require('../../services/data/first-time-claim')
const validator = require('../../services/validators/first-time/about-the-prisoner-validator')
const UrlPathValidator = require('../../services/validators/url-path-validator')

module.exports = function (router) {
  router.get('/first-time/:dob/:relationship/:assistance/:requireBenefitUpload', function (req, res, next) {
    UrlPathValidator(req.params)
    res.render('first-time/about-the-prisoner', {
      dob: req.params.dob,
      relationship: req.params.relationship,
      assistance: req.params.assistance,
      requireBenefitUpload: req.params.requireBenefitUpload
    })
    next()
  })

  router.post('/first-time/:dob/:relationship/:assistance/:requireBenefitUpload', function (req, res, next) {
    UrlPathValidator(req.params)
    var validationErrors = validator(req.body)
    if (validationErrors) {
      res.status(400).render('first-time/about-the-prisoner', {
        dob: req.params.dob,
        relationship: req.params.relationship,
        assistance: req.params.assistance,
        requireBenefitUpload: req.params.requireBenefitUpload,
        prisoner: req.body,
        errors: validationErrors })
      return next()
    }

    var prisoner = req.body
    firstTimeClaim.insertNewEligibilityAndPrisoner(prisoner)
      .then(function (newReference) {
        res.redirect(`/first-time/${req.params.dob}/${req.params.relationship}/${req.params.assistance}/${req.params.requireBenefitUpload}/${newReference}`)
        next()
      })
      .catch(function (error) {
        next(error)
      })
  })
}
