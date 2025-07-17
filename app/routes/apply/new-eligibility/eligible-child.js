const EligibleChild = require('../../../services/domain/eligible-child')
const ValidationError = require('../../../services/errors/validation-error')
const UrlPathValidator = require('../../../services/validators/url-path-validator')
const referenceIdHelper = require('../../helpers/reference-id-helper')
const insertNewEligibleChild = require('../../../services/data/insert-eligible-child')
const SessionHandler = require('../../../services/validators/session-handler')

module.exports = router => {
  router.get('/apply/:claimType/new-eligibility/eligible-child', (req, res) => {
    UrlPathValidator(req.params)
    const isValidSession = SessionHandler.validateSession(req.session, req.url)

    if (!isValidSession) {
      return res.redirect(SessionHandler.getErrorPath(req.session, req.url))
    }

    return res.render('apply/new-eligibility/eligible-child', {
      URL: req.url,
      claimType: req.session.claimType,
      dob: req.session.dobEncoded,
      relationship: req.session.relationship,
      benefit: req.session.benefit,
      referenceId: req.session.referenceId
    })
  })

  router.post('/apply/:claimType/new-eligibility/eligible-child', (req, res, next) => {
    UrlPathValidator(req.params)
    req.session.claimType = req.params.claimType
    const isValidSession = SessionHandler.validateSession(req.session, req.url)

    if (!isValidSession) {
      return res.redirect(SessionHandler.getErrorPath(req.session, req.url))
    }

    const eligibleChildDetails = req.body ?? {}

    try {
      const eligibleChild = new EligibleChild(
        req.body?.FirstName,
        req.body?.LastName,
        req.body?.ChildRelationship,
        req.body?.['dob-day'] ?? '',
        req.body?.['dob-month'] ?? '',
        req.body?.['dob-year'] ?? '',
        req.body?.ParentFirstName,
        req.body?.ParentLastName,
        req.body?.HouseNumberAndStreet,
        req.body?.Town,
        req.body?.County,
        req.body?.PostCode,
        req.body?.Country)

      const referenceAndEligibilityId = referenceIdHelper.extractReferenceId(req.session.referenceId)

      insertNewEligibleChild(eligibleChild, referenceAndEligibilityId.reference, referenceAndEligibilityId.id)
        .then(result => {
          const benefitOwner = req.session.benefitOwner

          if (req.body?.['add-another-child']) {
            return res.redirect(req.originalUrl)
          } else {
            if (benefitOwner === 'no') {
              return res.redirect(`/apply/${req.params.claimType}/new-eligibility/benefit-owner`)
            } else {
              return res.redirect(`/apply/${req.params.claimType}/new-eligibility/about-you`)
            }
          }
        })
        .catch(error => {
          next(error)
        })
    } catch (error) {
      if (error instanceof ValidationError) {
        return renderValidationError(req, res, eligibleChildDetails, error.validationErrors)
      } else {
        throw error
      }
    }
  })
}

function renderValidationError (req, res, eligibleChildDetails, validationErrors) {
  return res.status(400).render('apply/new-eligibility/eligible-child', {
    errors: validationErrors,
    URL: req.url,
    claimType: req.session.claimType,
    dob: req.session.dobEncoded,
    relationship: req.session.relationship,
    benefit: req.session.benefit,
    referenceId: req.session.referenceId,
    eligibleChild: eligibleChildDetails
  })
}
