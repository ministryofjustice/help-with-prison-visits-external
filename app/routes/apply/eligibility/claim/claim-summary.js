const fs = require('fs')
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
const config = require('../../../../../config')
const AWS = require('aws-sdk')
const s3 = new AWS.S3({
  accessKeyId: config.AWS_S3_ACCESS_KEY_ID,
  secretAccessKey: config.AWS_S3_ACCESS_KEY_SECRET
})

module.exports = function (router) {
  router.get('/apply/eligibility/claim/summary', function (req, res, next) {
    UrlPathValidator(req.params)
    const isValidSession = SessionHandler.validateSession(req.session, req.url)

    if (!isValidSession) {
      return res.redirect(SessionHandler.getErrorPath(req.session, req.url))
    }
    let savedClaimDetails
    getClaimSummary(req.session.claimId, req.session.claimType)
      .then(function (claimDetails) {
        savedClaimDetails = claimDetails

        if (req.session.ExpenseIsEnabled != null) {
          req.session.ExpenseIsEnabled = null
          const errors = ErrorHandler()
          errors.add('claim-expense', ERROR_MESSAGES.getExpenseDisabled)
          throw new ValidationError(errors.get())
        }

        return res.render('apply/eligibility/claim/claim-summary',
          {
            claimType: req.session.claimType,
            referenceId: req.session.referenceId,
            claimId: req.session.claimId,
            claimDetails: savedClaimDetails,
            dateHelper: dateHelper,
            claimExpenseHelper: claimExpenseHelper,
            displayHelper: displayHelper,
            benefitUploadNotRequired: benefitUploadNotRequired(req.session.claimType),
            URL: req.url
          })
      })
      .catch(function (error) {
        if (error instanceof ValidationError) {
          return res.status(400).render('apply/eligibility/claim/claim-summary', {
            errors: error.validationErrors,
            claimType: req.session.claimType,
            referenceId: req.session.referenceId,
            claimId: req.session.claimId,
            claimDetails: savedClaimDetails,
            dateHelper: dateHelper,
            claimExpenseHelper: claimExpenseHelper,
            displayHelper: displayHelper,
            benefitUploadNotRequired: benefitUploadNotRequired(req.session.claimType),
            URL: req.url
          })
        } else {
          next(error)
        }
      })
  })

  router.post('/apply/eligibility/claim/summary', function (req, res, next) {
    UrlPathValidator(req.params)
    const isValidSession = SessionHandler.validateSession(req.session, req.url)

    if (!isValidSession) {
      return res.redirect(SessionHandler.getErrorPath(req.session, req.url))
    }

    const referenceId = req.session.referenceId
    const claimId = req.session.claimId
    const claimType = req.session.claimType

    let savedClaimDetails
    getClaimSummary(req.session.claimId, req.session.claimType)
      .then(function (claimDetails) {
        savedClaimDetails = claimDetails

        const visitConfirmation = claimDetails.claim.visitConfirmation
        const benefit = claimDetails.claim.Benefit
        const benefitDocument = claimSummaryHelper.getBenefitDocument(claimDetails.claim.benefitDocument)
        const claimExpenses = claimDetails.claimExpenses
        const isAdvanceClaim = claimDetails.claim.IsAdvanceClaim
        const benefitUpload = benefitUploadNotRequired(claimType)

        new ClaimSummary(visitConfirmation, benefit, benefitDocument, claimExpenses, isAdvanceClaim, benefitUpload) // eslint-disable-line no-new
        return res.redirect(`/apply/eligibility/claim/bank-payment-details?isAdvance=${isAdvanceClaim}`)
      })
      .catch(function (error) {
        if (error instanceof ValidationError) {
          return res.status(400).render('apply/eligibility/claim/claim-summary', {
            errors: error.validationErrors,
            claimType: claimType,
            referenceId: referenceId,
            claimId: claimId,
            claimDetails: savedClaimDetails,
            dateHelper: dateHelper,
            claimExpenseHelper: claimExpenseHelper,
            displayHelper: displayHelper,
            benefitUploadNotRequired: benefitUploadNotRequired(claimType),
            URL: req.url
          })
        } else {
          next(error)
        }
      })
  })

  router.get('/apply/eligibility/claim/summary/view-document/:claimDocumentId', function (req, res, next) {
    UrlPathValidator(req.params)

    return claimSummaryHelper.getDocumentFilePath(req.params.claimDocumentId)
      .then(function (file) {
        const downloadParams = {
          Bucket: config.AWS_S3_BUCKET_NAME,
          Key: file.path
        }

        s3.getObject(downloadParams).promise().then((data) => {
          const tempFile = `${config.UPLOAD_FILE_TMP_DIR}/${file.path}`
          fs.writeFileSync(tempFile, data.Body)
          return res.download(tempFile, file.name)
        }).catch((err) => {
          throw err
        })
      })
      .catch(function (error) {
        next(error)
      })
  })

  router.post('/apply/eligibility/claim/summary/remove-expense/:claimExpenseId', function (req, res, next) {
    UrlPathValidator(req.params)

    return claimSummaryHelper.removeExpenseAndDocument(req.session.claimId, req.params.claimExpenseId, req.query.claimDocumentId)
      .then(function () {
        return res.redirect(claimSummaryHelper.buildClaimSummaryUrl(req))
      })
      .catch(function (error) {
        next(error)
      })
  })

  router.post('/apply/eligibility/claim/summary/remove-document/:claimDocumentId', function (req, res, next) {
    UrlPathValidator(req.params)

    return claimSummaryHelper.removeDocument(req.params.claimDocumentId)
      .then(function () {
        return res.redirect(claimSummaryHelper.buildRemoveDocumentUrl(req))
      })
      .catch(function (error) {
        next(error)
      })
  })
}
