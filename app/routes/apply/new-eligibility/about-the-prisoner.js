const UrlPathValidator = require('../../../services/validators/url-path-validator')
const referenceIdHelper = require('../../helpers/reference-id-helper')
const AboutThePrisoner = require('../../../services/domain/about-the-prisoner')
const ValidationError = require('../../../services/errors/validation-error')
const insertNewEligibilityAndPrisoner = require('../../../services/data/insert-new-eligibility-and-prisoner')
const displayHelper = require('../../../views/helpers/display-helper')
const SessionHandler = require('../../../services/validators/session-handler')
const prisonerRelationshipEnum = require('../../../constants/prisoner-relationships-enum')

module.exports = function (router) {
  router.get('/apply/:claimType/new-eligibility/about-the-prisoner', function (req, res) {
    UrlPathValidator(req.params)
    const isValidSession = SessionHandler.validateSession(req.session, req.url)

    if (!isValidSession) {
      return res.redirect(SessionHandler.getErrorPath(req.session, req.url))
    }

    return res.render('apply/new-eligibility/about-the-prisoner', {
      URL: req.url,
      prisonerNumber: req.session.prisonerNumber,
      displayHelper,
      showYCS: !!req.cookies['apvs-assisted-digital']
    })
  })

  router.post('/apply/:claimType/new-eligibility/about-the-prisoner', function (req, res, next) {
    UrlPathValidator(req.params)
    const isValidSession = SessionHandler.validateSession(req.session, req.url)

    if (!isValidSession) {
      return res.redirect(SessionHandler.getErrorPath(req.session, req.url))
    }

    const prisoner = req.body

    try {
      const aboutThePrisoner = new AboutThePrisoner(req.body.FirstName,
        req.body.LastName,
        req.body['dob-day'],
        req.body['dob-month'],
        req.body['dob-year'],
        req.body.PrisonerNumber,
        req.body.NameOfPrison)

      insertNewEligibilityAndPrisoner(aboutThePrisoner, req.params.claimType, req.session.decryptedRef)
        .then(function (result) {
          req.session.referenceId = referenceIdHelper.getReferenceId(result.reference, result.eligibilityId)
          req.session.decryptedRef = result.reference
          const benefitOwner = req.session.benefitOwner
          const relationships = Object.keys(prisonerRelationshipEnum)
          let relationship
          for (const r of relationships) {
            if (prisonerRelationshipEnum[r].urlValue === req.session.relationship) {
              relationship = prisonerRelationshipEnum[r].value
            }
          }
          if (relationship === 'eligible-child') {
            return res.redirect(`/apply/${req.params.claimType}/new-eligibility/eligible-child`)
          } else {
            if (benefitOwner === 'no') {
              return res.redirect(`/apply/${req.params.claimType}/new-eligibility/benefit-owner`)
            } else {
              return res.redirect(`/apply/${req.params.claimType}/new-eligibility/about-you`)
            }
          }
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
          prisoner,
          displayHelper
        })
      } else {
        throw error
      }
    }
  })
}
