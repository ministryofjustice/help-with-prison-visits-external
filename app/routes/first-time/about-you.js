const aboutYouValidator = require('../../services/validators/first-time/about-you-validator')
var visitor = require('../../services/data/visitor')

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
    // TODO path validation
    var validationErrors = aboutYouValidator(req.body)

    if (validationErrors) {
      res.status(400).render('first-time/about-you', {
        dob: req.params.dob,
        relationship: req.params.relationship,
        assistance: req.params.assistance,
        requireBenefitUpload: req.params.requireBenefitUpload,
        reference: req.params.reference,
        visitor: req.body,
        errors: validationErrors })
      return next()
    }

    var visitorData = req.body
    visitorData.DateOfBirth = req.params.dob
    visitorData.Relationship = req.params.relationship
    visitorData.JourneyAssistance = req.params.assistance
    visitorData.RequireBenefitUpload = req.params.requireBenefitUpload

    visitor.insert(req.params.reference, visitorData)
      .then(function () {
        res.redirect(`/application-submitted/${req.params.reference}`)
        next()
      })
      .catch(function (error) {
        next(error)
      })
  })
}
