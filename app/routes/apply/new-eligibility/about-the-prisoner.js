const UrlPathValidator = require('../../../services/validators/url-path-validator')
const referenceIdHelper = require('../../helpers/reference-id-helper')
const AboutThePrisoner = require('../../../services/domain/about-the-prisoner')
const ValidationError = require('../../../services/errors/validation-error')
const insertNewEligibilityAndPrisoner = require('../../../services/data/insert-new-eligibility-and-prisoner')
const displayHelper = require('../../../views/helpers/display-helper')

const REFERENCE_DOB_ERROR = '?error=expired'

module.exports = function (router) {
  router.get('/apply/:claimType/new-eligibility/:dob/:relationship/:benefit', function (req, res) {
    UrlPathValidator(req.params)

    if (!req.session ||
        !req.session.claimType ||
        !req.session.dobEncoded ||
        !req.session.relationship ||
        !req.session.benefit) {
      return res.redirect(`/apply/first-time/new-eligibility${REFERENCE_DOB_ERROR}`)
    }

    return res.render('apply/new-eligibility/about-the-prisoner', {
      URL: req.url,
      prisonerNumber: req.query['prisoner-number'],
      displayHelper: displayHelper
    })
  })

  router.post('/apply/:claimType/new-eligibility/:dob/:relationship/:benefit', function (req, res, next) {
    UrlPathValidator(req.params)

    if (!req.session || !req.session.claimType || !req.session.dobEncoded || !req.session.relationship || !req.session.benefit) {
      req.session.claimType = null
      req.session.dobEncoded = null
      req.session.relationship = null
      req.session.benefit = null
      return res.redirect(`/apply/first-time/new-eligibility${REFERENCE_DOB_ERROR}`)
    }

    var claimType = req.session.claimType
    var dobEncoded = req.session.dobEncoded
    var relationship = req.session.relationship
    var benefit = req.session.benefit

    var prisoner = req.body

    try {
      var aboutThePrisoner = new AboutThePrisoner(req.body['FirstName'],
        req.body['LastName'],
        req.body['dob-day'],
        req.body['dob-month'],
        req.body['dob-year'],
        req.body['PrisonerNumber'],
        req.body['NameOfPrison'])
      insertNewEligibilityAndPrisoner(aboutThePrisoner, claimType, req.query.reference)
        .then(function (result) {
          var referenceId = referenceIdHelper.getReferenceId(result.reference, result.eligibilityId)
          req.session.referenceId = referenceId

          return res.redirect(`/apply/${claimType}/new-eligibility/${dobEncoded}/${relationship}/${benefit}/${referenceId}`)
        })
        .catch(function (error) {
          next(error)
        })
    } catch (error) {
      if (error instanceof ValidationError) {
        return res.status(400).render('apply/new-eligibility/about-the-prisoner', {
          errors: error.validationErrors,
          URL: req.url,
          prisonerNumber: req.query['prisoner-number'],
          prisoner: prisoner,
          displayHelper: displayHelper
        })
      } else {
        throw error
      }
    }
  })
}
