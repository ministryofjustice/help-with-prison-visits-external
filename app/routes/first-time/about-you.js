const aboutYouValidator = require('../../services/validators/first-time/about-you-validator')
const UrlPathValidator = require('../../services/validators/url-path-validator')
const insertVisitor = require('../../services/data/insert-visitor')

module.exports = function (router) {
  router.get('/first-time/:dob/:relationship/:benefit/:reference', function (req, res) {
    UrlPathValidator.validate(req.params)
    return res.render('first-time/about-you', {
      dob: req.params.dob,
      relationship: req.params.relationship,
      benefit: req.params.benefit,
      reference: req.params.reference
    })
  })

  router.post('/first-time/:dob/:relationship/:benefit/:reference', function (req, res) {
    UrlPathValidator.validate(req.params)

    var validationErrors = aboutYouValidator(req.body)
    var dob = req.params.dob
    var relationship = req.params.relationship
    var benefit = req.params.benefit
    var reference = req.params.reference
    var visitorDetails = req.body

    if (validationErrors) {
      return res.status(400).render('first-time/about-you', {
        dob: dob,
        relationship: relationship,
        benefit: benefit,
        reference: reference,
        visitor: visitorDetails,
        errors: validationErrors
      })
    }

    var visitorData = visitorDetails
    visitorData.DateOfBirth = dob
    visitorData.Relationship = relationship
    visitorData.Benefit = benefit

    insertVisitor(req.params.reference, visitorData)
      .then(function () {
        return res.redirect(`/first-time-claim/eligibility/${req.params.reference}/new-claim`)
      })
  })
}
