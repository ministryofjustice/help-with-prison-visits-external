const UrlPathValidator = require('../../../../services/validators/url-path-validator')
const getClaimSummary = require('../../../../services/data/get-claim-summary')
const claimSummaryHelper = require('../../../helpers/claim-summary-helper')
const dateHelper = require('../../../../views/helpers/date-helper')
const claimExpenseHelper = require('../../../../views/helpers/claim-expense-helper')
const ClaimSummary = require('../../../../services/domain/claim-summary')
const ValidationError = require('../../../../services/errors/validation-error')
const benefitUploadNotRequired = require('../../../helpers/benefit-upload-not-required')
const displayHelper = require('../../../../views/helpers/display-helper')

// TODO: Pass this isAdvanceClaim boolean to the page.
module.exports = function (router) {
  router.get('/apply/:claimType/eligibility/:referenceId/claim/:claimId/summary', function (req, res, next) {
    UrlPathValidator(req.params)

    getClaimSummary(req.params.claimId, req.params.claimType)
      .then(function (claimDetails) {
        return res.render('apply/eligibility/claim/claim-summary',
          {
            claimType: req.params.claimType,
            referenceId: req.params.referenceId,
            claimId: req.params.claimId,
            claimDetails: claimDetails,
            dateHelper: dateHelper,
            claimExpenseHelper: claimExpenseHelper,
            displayHelper: displayHelper,
            benefitUploadNotRequired: benefitUploadNotRequired(req.params.claimType),
            URL: req.url
          })
      })
      .catch(function (error) {
        next(error)
      })
  })

  router.post('/apply/:claimType/eligibility/:referenceId/claim/:claimId/summary', function (req, res, next) {
    UrlPathValidator(req.params)

    var referenceId = req.params.referenceId
    var claimId = req.params.claimId
    var claimType = req.params.claimType

    var savedClaimDetails
    getClaimSummary(req.params.claimId, req.params.claimType)
      .then(function (claimDetails) {
        savedClaimDetails = claimDetails

        var visitConfirmation = claimDetails.claim.visitConfirmation
        var benefit = claimDetails.claim.Benefit
        var benefitDocument = claimSummaryHelper.getBenefitDocument(claimDetails.claim.benefitDocument)
        var claimExpenses = claimDetails.claimExpenses
        var isAdvanceClaim = claimDetails.claim.IsAdvanceClaim
        var benefitUpload = benefitUploadNotRequired(claimType)

        new ClaimSummary(visitConfirmation, benefit, benefitDocument, claimExpenses, isAdvanceClaim, benefitUpload) // eslint-disable-line no-new
        return res.redirect(`/apply/${claimType}/eligibility/${referenceId}/claim/${claimId}/bank-account-details?isAdvance=${isAdvanceClaim}`)
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

  router.get('/apply/:claimType/eligibility/:referenceId/claim/:claimId/summary/view-document/:claimDocumentId', function (req, res, next) {
    UrlPathValidator(req.params)

    return claimSummaryHelper.getDocumentFilePath(req.params.claimDocumentId)
      .then(function (file) {
        return res.download(file.path, file.name)
      })
      .catch(function (error) {
        next(error)
      })
  })

  router.post('/apply/:claimType/eligibility/:referenceId/claim/:claimId/summary/remove-expense/:claimExpenseId', function (req, res, next) {
    UrlPathValidator(req.params)

    return claimSummaryHelper.removeExpenseAndDocument(req.params.claimId, req.params.claimExpenseId, req.query.claimDocumentId)
      .then(function () {
        return res.redirect(claimSummaryHelper.buildClaimSummaryUrl(req))
      })
      .catch(function (error) {
        next(error)
      })
  })

  router.post('/apply/:claimType/eligibility/:referenceId/claim/:claimId/summary/remove-document/:claimDocumentId', function (req, res, next) {
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
