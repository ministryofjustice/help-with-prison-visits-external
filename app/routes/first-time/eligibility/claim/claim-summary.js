const UrlPathValidator = require('../../../../services/validators/url-path-validator')
const getClaimSummary = require('../../../../services/data/get-claim-summary')
const removeClaimExpense = require('../../../../services/data/remove-claim-expense')
const removeClaimDocument = require('../../../../services/data/remove-claim-document')
const dateHelper = require('../../../../views/helpers/date-helper')
const claimExpenseHelper = require('../../../../views/helpers/claim-expense-helper')
const benefitsEnum = require('../../../../constants/benefits-enum')
const ClaimSummary = require('../../../../services/domain/claim-summary')
const ValidationError = require('../../../../services/errors/validation-error')
const getClaimDocumentFilePath = require('../../../../services/data/get-claim-document-file-path')

module.exports = function (router) {
  router.get('/first-time/eligibility/:referenceId/claim/:claimId/summary', function (req, res, next) {
    UrlPathValidator(req.params)

    getClaimSummary(req.params.claimId)
      .then(function (claimDetails) {
        return res.render('first-time/eligibility/claim/claim-summary',
          {
            referenceId: req.params.referenceId,
            claimId: req.params.claimId,
            claimDetails: claimDetails,
            dateHelper: dateHelper,
            claimExpenseHelper: claimExpenseHelper,
            benefitsEnum: benefitsEnum
          })
      })
      .catch(function (error) {
        next(error)
      })
  })

  router.post('/first-time/eligibility/:referenceId/claim/:claimId/summary', function (req, res, next) {
    UrlPathValidator(req.params)
    var savedClaimDetails
    getClaimSummary(req.params.claimId)
      .then(function (claimDetails) {
        savedClaimDetails = claimDetails
        var benefitDocument
        if (claimDetails.claim.benefitDocument === []) {
          benefitDocument = {DocumentStatus: null}
        } else {
          benefitDocument = claimDetails.claim.benefitDocument[0]
        }
        var claimSummary = new ClaimSummary(claimDetails.claim.visitConfirmation, claimDetails.claim.Benefit, benefitDocument) // eslint-disable-line no-unused-vars
        return res.redirect(`/first-time/eligibility/${req.params.referenceId}/claim/${req.params.claimId}/bank-account-details`)
      })
      .catch(function (error) {
        if (error instanceof ValidationError) {
          return res.status(400).render('first-time/eligibility/claim/claim-summary', {
            referenceId: req.params.referenceId,
            claimId: req.params.claimId,
            claimDetails: savedClaimDetails,
            dateHelper: dateHelper,
            claimExpenseHelper: claimExpenseHelper,
            benefitsEnum: benefitsEnum,
            errors: error.validationErrors
          })
        } else {
          next(error)
        }
      })
  })

  router.post('/first-time/eligibility/:referenceId/claim/:claimId/summary/remove/:claimExpenseId', function (req, res, next) {
    UrlPathValidator(req.params)

    removeClaimExpense(req.params.claimId, req.params.claimExpenseId)
      .then(function () {
        return res.redirect(`/first-time/eligibility/${req.params.referenceId}/claim/${req.params.claimId}/summary`)
      })
      .catch(function (error) {
        next(error)
      })
  })

  router.get('/first-time/eligibility/:referenceId/claim/:claimId/summary/viewFile/:claimDocumentId', function (req, res, next) {
    UrlPathValidator(req.params)

    getClaimDocumentFilePath(req.params.claimDocumentId)
      .then(function (result) {
        var path = result.Filepath
        if (path) {
          var fileName = 'APVS-Upload.' + path.split('.').pop()
          return res.download(path, fileName)
        } else {
          throw new Error('No path to file provided')
        }
      })
      .catch(function (error) {
        next(error)
      })
  })

  router.post('/first-time/eligibility/:referenceId/claim/:claimId/summary/removeFile/:claimDocumentId', function (req, res, next) {
    UrlPathValidator(req.params)
    removeClaimDocument(req.params.claimDocumentId)
      .then(function () {
        return res.redirect(`/first-time/eligibility/${req.params.referenceId}/claim/${req.params.claimId}/summary`)
      })
      .catch(function (error) {
        next(error)
      })
  })
}
