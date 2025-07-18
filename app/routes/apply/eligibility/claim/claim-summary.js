const UrlPathValidator = require('../../../../services/validators/url-path-validator')
const getClaimSummary = require('../../../../services/data/get-claim-summary')
const claimSummaryHelper = require('../../../helpers/claim-summary-helper')
const dateHelper = require('../../../../views/helpers/date-helper')
const claimExpenseHelper = require('../../../../views/helpers/claim-expense-helper')
const ClaimSummary = require('../../../../services/domain/claim-summary')
const ValidationError = require('../../../../services/errors/validation-error')
const benefitUploadNotRequired = require('../../../helpers/benefit-upload-not-required')
const displayHelper = require('../../../../views/helpers/display-helper')
const SessionHandler = require('../../../../services/validators/session-handler')
const ErrorHandler = require('../../../../services/validators/error-handler')
const ERROR_MESSAGES = require('../../../../services/validators/validation-error-messages')
const AWSHelper = require('../../../../services/aws-helper')

const aws = new AWSHelper()

module.exports = router => {
  router.get('/apply/eligibility/claim/summary', (req, res, next) => {
    UrlPathValidator(req.params)
    const isValidSession = SessionHandler.validateSession(req.session, req.url)

    if (!isValidSession) {
      return res.redirect(SessionHandler.getErrorPath(req.session, req.url))
    }
    let savedClaimDetails
    getClaimSummary(req.session.claimId, req.session.claimType)
      .then(claimDetails => {
        savedClaimDetails = claimDetails

        if (req.session.ExpenseIsEnabled != null) {
          req.session.ExpenseIsEnabled = null
          const errors = ErrorHandler()
          errors.add('claim-expense', ERROR_MESSAGES.getExpenseDisabled)
          throw new ValidationError(errors.get())
        }

        return res.render('apply/eligibility/claim/claim-summary', {
          claimType: req.session.claimType,
          referenceId: req.session.referenceId,
          claimId: req.session.claimId,
          claimDetails: savedClaimDetails,
          dateHelper,
          claimExpenseHelper,
          displayHelper,
          benefitUploadNotRequired: benefitUploadNotRequired(req.session.claimType),
          URL: req.url,
        })
      })
      .catch(error => {
        if (error instanceof ValidationError) {
          return res.status(400).render('apply/eligibility/claim/claim-summary', {
            errors: error.validationErrors,
            claimType: req.session.claimType,
            referenceId: req.session.referenceId,
            claimId: req.session.claimId,
            claimDetails: savedClaimDetails,
            dateHelper,
            claimExpenseHelper,
            displayHelper,
            benefitUploadNotRequired: benefitUploadNotRequired(req.session.claimType),
            URL: req.url,
          })
        }
        return next(error)
      })

    return null
  })

  router.post('/apply/eligibility/claim/summary', (req, res, next) => {
    UrlPathValidator(req.params)
    const isValidSession = SessionHandler.validateSession(req.session, req.url)

    if (!isValidSession) {
      return res.redirect(SessionHandler.getErrorPath(req.session, req.url))
    }

    const { referenceId } = req.session
    const { claimId } = req.session
    const { claimType } = req.session

    let savedClaimDetails
    getClaimSummary(req.session.claimId, req.session.claimType)
      .then(claimDetails => {
        savedClaimDetails = claimDetails

        const { visitConfirmation } = claimDetails.claim
        const benefit = claimDetails.claim.Benefit
        const benefitDocument = claimSummaryHelper.getBenefitDocument(claimDetails.claim.benefitDocument)
        const { claimExpenses } = claimDetails
        const isAdvanceClaim = claimDetails.claim.IsAdvanceClaim
        const benefitUpload = benefitUploadNotRequired(claimType)

        new ClaimSummary(visitConfirmation, benefit, benefitDocument, claimExpenses, isAdvanceClaim, benefitUpload) // eslint-disable-line no-new
        return res.redirect(`/apply/eligibility/claim/bank-payment-details?isAdvance=${isAdvanceClaim}`)
      })
      .catch(error => {
        if (error instanceof ValidationError) {
          return res.status(400).render('apply/eligibility/claim/claim-summary', {
            errors: error.validationErrors,
            claimType,
            referenceId,
            claimId,
            claimDetails: savedClaimDetails,
            dateHelper,
            claimExpenseHelper,
            displayHelper,
            benefitUploadNotRequired: benefitUploadNotRequired(claimType),
            URL: req.url,
          })
        }
        return next(error)
      })

    return null
  })

  router.get('/apply/eligibility/claim/summary/view-document/:claimDocumentId', (req, res, next) => {
    UrlPathValidator(req.params)

    return claimSummaryHelper
      .getDocumentFilePath(req.params.claimDocumentId)
      .then(async file => {
        const awsDownloadPath = await aws.download(file.path)

        res.download(awsDownloadPath, file.name)
      })
      .catch(error => {
        next(error)
      })
  })

  router.post('/apply/eligibility/claim/summary/remove-expense/:claimExpenseId', (req, res, next) => {
    UrlPathValidator(req.params)

    return claimSummaryHelper
      .removeExpenseAndDocument(req.session.claimId, req.params.claimExpenseId, req.query?.claimDocumentId)
      .then(() => {
        return res.redirect(claimSummaryHelper.buildClaimSummaryUrl(req))
      })
      .catch(error => {
        next(error)
      })
  })

  router.post('/apply/eligibility/claim/summary/remove-document/:claimDocumentId', (req, res, next) => {
    UrlPathValidator(req.params)

    return claimSummaryHelper
      .removeDocument(req.params.claimDocumentId)
      .then(() => {
        return res.redirect(claimSummaryHelper.buildRemoveDocumentUrl(req))
      })
      .catch(error => {
        next(error)
      })
  })
}
