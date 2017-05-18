const UrlPathValidator = require('../../../services/validators/url-path-validator')
const referenceIdHelper = require('../../helpers/reference-id-helper')
const AboutThePrisoner = require('../../../services/domain/about-the-prisoner')
const ValidationError = require('../../../services/errors/validation-error')
const insertNewEligibilityAndPrisoner = require('../../../services/data/insert-new-eligibility-and-prisoner')
const displayHelper = require('../../../views/helpers/display-helper')
const SessionHandler = require('../../../services/validators/session-handler')

module.exports = function (router) {
  router.get('/apply/:claimType/new-eligibility/about-the-prisoner', function (req, res) {
    UrlPathValidator(req.params)
    var isValidSession = SessionHandler.validateSession(req.session, req.url)

    if (!isValidSession) {
      return res.redirect(SessionHandler.getErrorPath(req.session, req.url))
    }

    return res.render('apply/new-eligibility/about-the-prisoner', {
      URL: req.url,
      prisonerNumber: req.session.prisonerNumber,
      displayHelper: displayHelper
    })
  })

  router.post('/apply/:claimType/new-eligibility/about-the-prisoner', function (req, res, next) {
    UrlPathValidator(req.params)
    var isValidSession = SessionHandler.validateSession(req.session, req.url)

    if (!isValidSession) {
      return res.redirect(SessionHandler.getErrorPath(req.session, req.url))
    }

    var prisoner = req.body

    try {
      var aboutThePrisoner = new AboutThePrisoner(req.body['FirstName'],
        req.body['LastName'],
        req.body['dob-day'],
        req.body['dob-month'],
        req.body['dob-year'],
        req.body['PrisonerNumber'],
        req.body['NameOfPrison'])

      insertNewEligibilityAndPrisoner(aboutThePrisoner, req.params.claimType, req.session.decryptedRef)
        .then(function (result) {
          req.session.referenceId = referenceIdHelper.getReferenceId(result.reference, result.eligibilityId)
          req.session.decryptedRef = result.reference

          return res.redirect(`/apply/${req.params.claimType}/new-eligibility/about-you`)
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
