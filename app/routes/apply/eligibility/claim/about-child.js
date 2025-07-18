const AboutChild = require('../../../../services/domain/about-child')
const UrlPathValidator = require('../../../../services/validators/url-path-validator')
const referenceIdHelper = require('../../../helpers/reference-id-helper')
const ValidationError = require('../../../../services/errors/validation-error')
const insertChild = require('../../../../services/data/insert-child')
const SessionHandler = require('../../../../services/validators/session-handler')

module.exports = router => {
  router.get('/apply/eligibility/claim/about-child', (req, res) => {
    UrlPathValidator(req.params)
    const isValidSession = SessionHandler.validateSession(req.session, req.url)

    if (!isValidSession) {
      return res.redirect(SessionHandler.getErrorPath(req.session, req.url))
    }

    return res.render('apply/eligibility/claim/about-child', {
      claimType: req.session.claimType,
      referenceId: req.session.referenceId,
      claimId: req.session.claimId,
    })
  })

  router.post('/apply/eligibility/claim/about-child', (req, res, next) => {
    UrlPathValidator(req.params)
    const isValidSession = SessionHandler.validateSession(req.session, req.url)

    if (!isValidSession) {
      return res.redirect(SessionHandler.getErrorPath(req.session, req.url))
    }

    const referenceAndEligibilityId = referenceIdHelper.extractReferenceId(req.session.referenceId)

    try {
      const child = new AboutChild(
        req.body?.FirstName,
        req.body?.LastName,
        req.body?.['dob-day'] ?? '',
        req.body?.['dob-month'] ?? '',
        req.body?.['dob-year'] ?? '',
        req.body?.['child-relationship'] ?? '',
      )

      insertChild(referenceAndEligibilityId.reference, referenceAndEligibilityId.id, req.session.claimId, child)
        .then(() => {
          if (req.body?.['add-another-child']) {
            return res.redirect(req.originalUrl)
          }
          return res.redirect('/apply/eligibility/claim/expenses')
        })
        .catch(error => {
          next(error)
        })
    } catch (error) {
      if (error instanceof ValidationError) {
        return res.status(400).render('apply/eligibility/claim/about-child', {
          errors: error.validationErrors,
          claimType: req.session.claimType,
          referenceId: req.session.referenceId,
          claimId: req.session.claimId,
          claimant: req.body ?? {},
        })
      }
      throw error
    }

    return null
  })
}
