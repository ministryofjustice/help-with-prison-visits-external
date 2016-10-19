const aboutYouValidator = require('../../services/validators/first-time/about-you-validator')

module.exports = function (router) {
  router.get('/first-time/:dob/:relationship/:assistance/:requireBenefitUpload/:reference', function (req, res, next) {
    // TODO path validation
    res.render('first-time/about-you', {
      dob: req.params.dob,
      relationship: req.params.relationship,
      assistance: req.params.assistance,
      requireBenefitUpload: req.params.requireBenefitUpload,
      reference: req.params.reference
    })
    next()
  })

  router.post('/first-time/:dob/:relationship/:assistance/:requireBenefitUpload/:reference', function (req, res, next) {
    var validationErrors = aboutYouValidator(req.body)

    if (validationErrors) {
      res.status(400).render('first-time/about-you', {
        dob: req.params.dob,
        relationship: req.params.relationship,
        assistance: req.params.assistance,
        requireBenefitUpload: req.params.requireBenefitUpload,
        reference: req.params.reference,
        claiment: req.body,
      errors: validationErrors })
      return next()
    }

    res.redirect('/visit-type')
    next()
  })
}
