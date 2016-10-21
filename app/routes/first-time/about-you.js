const aboutYouValidator = require('../../services/validators/first-time/about-you-validator')
const UrlPathValidator = require('../../services/validators/url-path-validator')
const visitor = require('../../services/data/visitor')

module.exports = function (router) {
  router.get('/first-time/:dob/:relationship/:assistance/:requireBenefitUpload/:reference', function (req, res) {
    UrlPathValidator(req.params)
    return res.render('first-time/about-you', {
      dob: req.params.dob,
      relationship: req.params.relationship,
      assistance: req.params.assistance,
      requireBenefitUpload: req.params.requireBenefitUpload,
      reference: req.params.reference
    })
  })

  router.post('/first-time/:dob/:relationship/:assistance/:requireBenefitUpload/:reference', function (req, res) {
    UrlPathValidator(req.params)

    var validationErrors = aboutYouValidator(req.body)
    var dob = req.params.dob
    var relationship = req.params.relationship
    var assistance = req.params.assistance
    var requireBenefitUpload = req.params.requireBenefitUpload
    var reference = req.params.reference
    var visitorDetails = req.body

    if (validationErrors) {
      return res.status(400).render('first-time/about-you', {
        dob: dob,
        relationship: relationship,
        assistance: assistance,
        requireBenefitUpload: requireBenefitUpload,
        reference: reference,
        visitor: visitorDetails,
        errors: validationErrors
      })
    }

    var visitorData = visitorDetails
    visitorData.DateOfBirth = dob
    visitorData.Relationship = relationship
    visitorData.JourneyAssistance = assistance
    visitorData.RequireBenefitUpload = requireBenefitUpload

    visitor.insert(req.params.reference, visitorData)
      .then(function () {
        return res.redirect(`/application-submitted/${reference}`)
      })
  })
}
