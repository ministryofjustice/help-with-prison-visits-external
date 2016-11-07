const AboutYou = require('../../../services/domain/about-you')
const ValidationError = require('../../../services/errors/validation-error')
const UrlPathValidator = require('../../../services/validators/url-path-validator')
const insertVisitor = require('../../../services/data/insert-visitor')

module.exports = function (router) {
  router.get('/first-time/new-eligibility/:dob/:relationship/:benefit/:reference', function (req, res) {
    UrlPathValidator(req.params)

    return res.render('first-time/new-eligibility/about-you', {
      dob: req.params.dob,
      relationship: req.params.relationship,
      benefit: req.params.benefit,
      reference: req.params.reference
    })
  })

  router.post('/first-time/new-eligibility/:dob/:relationship/:benefit/:reference', function (req, res) {
    UrlPathValidator(req.params)

    var dob = req.params.dob
    var relationship = req.params.relationship
    var benefit = req.params.benefit
    var reference = req.params.reference
    var visitorDetails = req.body

    try {
      var aboutYou = new AboutYou(dob, relationship, benefit,
        req.body['Title'],
        req.body['FirstName'],
        req.body['LastName'],
        req.body['NationalInsuranceNumber'],
        req.body['HouseNumberAndStreet'],
        req.body['Town'],
        req.body['County'],
        req.body['PostCode'],
        req.body['Country'],
        req.body['EmailAddress'],
        req.body['PhoneNumber'])

      insertVisitor(req.params.reference, aboutYou)
      .then(function () {
        return res.redirect(`/first-time/eligibility/${req.params.reference}/new-claim`)
      })
    } catch (error) {
      if (error instanceof ValidationError) {
        return res.status(400).render('first-time/new-eligibility/about-you', {
          dob: dob,
          relationship: relationship,
          benefit: benefit,
          reference: reference,
          visitor: visitorDetails,
          errors: error.validationErrors
        })
      } else {
        throw error
      }
    }
  })
}
