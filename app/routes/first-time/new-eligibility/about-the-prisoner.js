const UrlPathValidator = require('../../../services/validators/url-path-validator')
const AboutThePrisoner = require('../../../services/domain/about-the-prisoner')
const ValidationError = require('../../../services/errors/validation-error')
const insertNewEligibilityAndPrisoner = require('../../../services/data/insert-new-eligibility-and-prisoner')

module.exports = function (router) {
  router.get('/first-time/new-eligibility/:dob/:relationship/:benefit', function (req, res) {
    UrlPathValidator(req.params)
    return res.render('first-time/new-eligibility/about-the-prisoner', {
      dob: req.params.dob,
      relationship: req.params.relationship,
      benefit: req.params.benefit
    })
  })

  router.post('/first-time/new-eligibility/:dob/:relationship/:benefit', function (req, res) {
    UrlPathValidator(req.params)

    var dob = req.params.dob
    var relationship = req.params.relationship
    var benefit = req.params.benefit
    var prisoner = req.body

    try {
      var aboutThePrisoner = new AboutThePrisoner(req.body['FirstName'],
        req.body['LastName'],
        req.body['dob-day'],
        req.body['dob-month'],
        req.body['dob-year'],
        req.body['PrisonerNumber'],
        req.body['NameOfPrison'])

      insertNewEligibilityAndPrisoner(aboutThePrisoner)
        .then(function (newReference) {
          return res.redirect(`/first-time/new-eligibility/${dob}/${relationship}/${benefit}/${newReference}`)
        })
    } catch (error) {
      if (error instanceof ValidationError) {
        return res.status(400).render('first-time/new-eligibility/about-the-prisoner', {
          dob: dob,
          relationship: relationship,
          benefit: benefit,
          prisoner: prisoner,
          errors: error.validationErrors
        })
      } else {
        throw error
      }
    }
  })
}
