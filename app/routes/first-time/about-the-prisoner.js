var firstTimeClaim = require('../../services/data/first-time-claim')

module.exports = function (router) {
  router.get('/first-time/:dob/:relationship/:assistance/:requireBenefitUpload', function (req, res, next) {
    // TODO path validation
    res.render('first-time/about-the-prisoner', {
      dob: req.params.dob,
      relationship: req.params.relationship,
      assistance: req.params.assistance,
      requireBenefitUpload: req.params.requireBenefitUpload
    })
    next()
  })

  router.post('/first-time/:dob/:relationship/:assistance/:requireBenefitUpload', function (req, res, next) {
    // TODO path validation
    var validationErrors = false // TODO call validator

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
