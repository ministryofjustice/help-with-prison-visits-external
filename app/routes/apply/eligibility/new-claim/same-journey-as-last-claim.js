const UrlPathValidator = require('../../../../services/validators/url-path-validator')
const referenceIdHelper = require('../../../helpers/reference-id-helper')
const ValidationError = require('../../../../services/errors/validation-error')
const SameJourneyAsLastClaim = require('../../../../services/domain/same-journey-as-last-claim')
const getLastClaimDetails = require('../../../../services/data/get-last-claim-details')
const claimExpenseHelper = require('../../../../views/helpers/claim-expense-helper')
const displayHelper = require('../../../../views/helpers/display-helper')
const SessionHandler = require('../../../../services/validators/session-handler')

module.exports = router => {
  router.get('/apply/eligibility/new-claim/same-journey-as-last-claim', (req, res, next) => {
    UrlPathValidator(req.params)
    const isValidSession = SessionHandler.validateSession(req.session, req.url)

    if (!isValidSession) {
      return res.redirect(SessionHandler.getErrorPath(req.session, req.url))
    }

    const isAdvancedClaim = req.session.advanceOrPast === 'advance'

    const referenceAndEligibilityId = referenceIdHelper.extractReferenceId(req.session.referenceId)

    getLastClaimDetails(referenceAndEligibilityId.reference, referenceAndEligibilityId.id, true, isAdvancedClaim)
      .then(lastClaimDetails => {
        if (lastClaimDetails.expenses[0]) {
          return res.render('apply/eligibility/new-claim/same-journey-as-last-claim', {
            referenceId: req.session.referenceId,
            advanceOrPast: req.session.advanceOrPast,
            lastClaimDetails,
            claimExpenseHelper,
            displayHelper,
          })
        }
        return res.redirect('/apply/eligibility/new-claim/journey-information')
      })
      .catch(error => {
        next(error)
      })

    return null
  })

  router.post('/apply/eligibility/new-claim/same-journey-as-last-claim', (req, res, next) => {
    UrlPathValidator(req.params)
    const isValidSession = SessionHandler.validateSession(req.session, req.url)

    if (!isValidSession) {
      return res.redirect(SessionHandler.getErrorPath(req.session, req.url))
    }

    const referenceAndEligibilityId = referenceIdHelper.extractReferenceId(req.session.referenceId)

    try {
      new SameJourneyAsLastClaim(req.body?.['same-journey-as-last-claim'] ?? '') // eslint-disable-line no-new

      req.session.claimType = 'repeat'
      if (req.body && req.body['same-journey-as-last-claim'] === 'yes') {
        req.session.claimType = 'repeat-duplicate'
      }

      return res.redirect('/apply/eligibility/new-claim/journey-information')
    } catch (error) {
      if (error instanceof ValidationError) {
        getLastClaimDetails(referenceAndEligibilityId.reference, referenceAndEligibilityId.id, true)
          .then(lastClaimDetails => {
            return res.status(400).render('apply/eligibility/new-claim/same-journey-as-last-claim', {
              errors: error.validationErrors,
              referenceId: req.session.referenceId,
              advanceOrPast: req.session.advanceOrPast,
              lastClaimDetails,
              claimExpenseHelper,
              displayHelper,
            })
          })
          .catch(innerError => {
            next(innerError)
          })
      } else {
        throw error
      }
    }

    return null
  })
}
