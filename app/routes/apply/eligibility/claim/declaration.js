const Declaration = require('../../../../services/domain/declaration')
const submitClaim = require('../../../../services/data/submit-claim')
const ValidationError = require('../../../../services/errors/validation-error')
const UrlPathValidator = require('../../../../services/validators/url-path-validator')
const referenceIdHelper = require('../../../helpers/reference-id-helper')
const getIsAdvanceClaim = require('../../../../services/data/get-is-advance-claim')
const checkStatusForFinishingClaim = require('../../../../services/data/check-status-for-finishing-claim')
const checkIfReferenceIsDisabled = require('../../../../services/data/check-if-reference-is-disabled')
const SessionHandler = require('../../../../services/validators/session-handler')

module.exports = router => {
  router.get('/apply/eligibility/claim/declaration', (req, res) => {
    UrlPathValidator(req.params)
    const isValidSession = SessionHandler.validateSession(req.session, req.url)

    if (!isValidSession) {
      return res.redirect(SessionHandler.getErrorPath(req.session, req.url))
    }

    return res.render('apply/eligibility/claim/declaration', {
      claimType: req.session.claimType,
      referenceId: req.session.referenceId,
      claimId: req.session.claimId,
      isAdvance: req.query?.isAdvance,
      paymentMethod: req.session.paymentMethod,
    })
  })

  router.post('/apply/eligibility/claim/declaration', (req, res, next) => {
    UrlPathValidator(req.params)
    const isValidSession = SessionHandler.validateSession(req.session, req.url)

    if (!isValidSession) {
      return res.redirect(SessionHandler.getErrorPath(req.session, req.url))
    }

    const referenceAndEligibilityId = referenceIdHelper.extractReferenceId(req.session.referenceId)
    const assistedDigitalCaseWorker = req.cookies?.['apvs-assisted-digital']

    try {
      new Declaration(req.body?.['terms-and-conditions-input'] ?? '') // eslint-disable-line no-new
      return checkIfReferenceIsDisabled(referenceAndEligibilityId.reference).then(isDisabled => {
        return checkStatusForFinishingClaim(
          referenceAndEligibilityId.reference,
          referenceAndEligibilityId.id,
          req.session.claimId,
        ).then(claimInProgress => {
          if (isDisabled === true) {
            return res.redirect(SessionHandler.getErrorPath(req.session, req.url, true))
          }
          if (claimInProgress) {
            return finishClaim(
              res,
              referenceAndEligibilityId.reference,
              referenceAndEligibilityId.id,
              req.session.claimId,
              req.session.claimType,
              assistedDigitalCaseWorker,
              req.query?.paymentMethod,
            ).catch(error => {
              next(error)
            })
          }
          return redirectApplicationSubmitted(res, referenceAndEligibilityId.reference, req.session.claimId)
        })
      })
    } catch (error) {
      if (error instanceof ValidationError) {
        return res.status(400).render('apply/eligibility/claim/declaration', {
          errors: error.validationErrors,
          claimType: req.session.claimType,
          paymentDetailsAndDeclaration: req.body ?? {},
          referenceId: req.session.referenceId,
          claimId: req.session.claimId,
          isAdvance: req.query?.isAdvance,
          paymentMethod: req.query?.paymentMethod,
        })
      }
      throw error
    }
  })
}

function finishClaim(res, reference, eligibilityId, claimId, claimType, assistedDigitalCaseWorker, paymentMethod) {
  return submitClaim(reference, eligibilityId, claimId, claimType, assistedDigitalCaseWorker, paymentMethod).then(
    () => {
      return redirectApplicationSubmitted(res, reference, claimId)
    },
  )
}

function redirectApplicationSubmitted(res, reference, claimId) {
  getIsAdvanceClaim(claimId).then(() => {
    return res.redirect('/application-submitted')
  })
}
