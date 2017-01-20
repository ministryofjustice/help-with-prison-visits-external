const UrlPathValidator = require('../../services/validators/url-path-validator')
const getViewClaim = require('../../services/data/get-view-claim')
const displayHelper = require('../../views/helpers/display-helper')
const dateHelper = require('../../views/helpers/date-helper')
const claimExpenseHelper = require('../../views/helpers/claim-expense-helper')
const referenceIdHelper = require('../helpers/reference-id-helper')
const ViewClaim = require('../../services/domain/view-claim')
const ValidationError = require('../../services/errors/validation-error')
const getClaimDocumentFilePath = require('../../services/data/get-claim-document-file-path')
const removeClaimDocument = require('../../services/data/remove-claim-document')
const submitUpdate = require('../../services/data/submit-update')
const claimStatusHelper = require('../../views/helpers/claim-status-helper')
const claimEventHelper = require('../../views/helpers/claim-event-helper')
const forEdit = require('../helpers/for-edit')
const decrypt = require('../../services/helpers/decrypt')

module.exports = function (router) {
  router.get('/your-claims/:dob/:reference/:claimId', function (req, res, next) {
    UrlPathValidator(req.params)

    var decryptedReference = decrypt(req.params.reference)
    getViewClaim(req.params.claimId, decryptedReference, req.params.dob)
      .then(function (claimDetails) {
        var referenceId = referenceIdHelper.getReferenceId(decryptedReference, claimDetails.claim.EligibilityId)
        return res.render('your-claims/view-claim',
          {
            reference: decryptedReference,
            referenceId: referenceId,
            encryptedReference: req.params.reference,
            dob: req.params.dob,
            claimId: req.params.claimId,
            claimDetails: claimDetails,
            dateHelper: dateHelper,
            claimExpenseHelper: claimExpenseHelper,
            displayHelper: displayHelper,
            URL: req.url,
            forEdit: forEdit(claimDetails.claim.Status, claimDetails.claim.IsAdvanceClaim, claimDetails.claim.DateOfJourney, req.query.updated),
            viewClaim: true,
            claimStatusHelper: claimStatusHelper,
            claimEventHelper: claimEventHelper,
            isRequestInfoPayment: claimDetails.claim.Status === 'REQUEST-INFO-PAYMENT',
            forReview: claimDetails.claim.Status === 'NEW' || claimDetails.claim.Status === 'UPDATED',
            updated: req.query.updated
          })
      })
  })

  router.post('/your-claims/:dob/:reference/:claimId', function (req, res, next) {
    UrlPathValidator(req.params)
    var SortCode = req.body['SortCode']
    var AccountNumber = req.body['AccountNumber']
    var message = req.body['message-to-caseworker']

    var decryptedReference = decrypt(req.params.reference)

    getViewClaim(req.params.claimId, decryptedReference, req.params.dob)
      .then(function (claimDetails) {
        try {
          var benefit = claimDetails.claim.benefitDocument
          if (benefit.length <= 0) {
            benefit.push({fromInternalWeb: true})
          }

          var bankDetails = { accountNumber: AccountNumber, sortCode: SortCode, required: claimDetails.claim.Status === 'REQUEST-INFO-PAYMENT' }
          var claim = new ViewClaim(claimDetails.claim.visitConfirmation.fromInternalWeb, benefit[0].fromInternalWeb, claimDetails.claimExpenses, message, bankDetails) // eslint-disable-line no-unused-vars
          submitUpdate(decryptedReference, claimDetails.claim.EligibilityId, req.params.claimId, message, bankDetails)
            .then(function () {
              return res.redirect(`/your-claims/${req.params.dob}/${req.params.reference}/${req.params.claimId}?updated=true`)
            })
        } catch (error) {
          if (error instanceof ValidationError) {
            var referenceId = referenceIdHelper.getReferenceId(req.params.reference, claimDetails.claim.EligibilityId)
            return res.status(400).render('your-claims/view-claim', {
              errors: error.validationErrors,
              reference: decryptedReference,
              referenceId: referenceId,
              encryptedReference: req.params.reference,
              claimId: req.params.claimId,
              claimDetails: claimDetails,
              dateHelper: dateHelper,
              dob: req.params.dob,
              claimExpenseHelper: claimExpenseHelper,
              displayHelper: displayHelper,
              URL: req.url,
              forEdit: forEdit(claimDetails.claim.Status, claimDetails.claim.IsAdvanceClaim, claimDetails.claim.DateOfJourney),
              viewClaim: true,
              claimEventHelper: claimEventHelper,
              bankDetails: { AccountNumber, SortCode },
              isRequestInfoPayment: bankDetails.required
            })
          } else {
            next(error)
          }
        }
      })
  })

  router.get('/your-claims/:dob/:reference/:claimId/view-document/:claimDocumentId', function (req, res, next) {
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

  router.post('/your-claims/:dob/:reference/:claimId/remove-document/:claimDocumentId', function (req, res, next) {
    UrlPathValidator(req.params)

    removeClaimDocument(req.params.claimDocumentId)
      .then(function () {
        if (req.query.multipage) {
          return res.redirect(`/your-claims/${req.params.dob}/${req.params.reference}/${req.params.claimId}`)
        } else {
          if (req.query.claimExpenseId) {
            return res.redirect(`/your-claims/${req.params.dob}/${req.params.reference}/${req.params.claimId}/file-upload?document=${req.query.document}&claimExpenseId=${req.query.claimExpenseId}&eligibilityId=${req.query.eligibilityId}`)
          } else {
            return res.redirect(`/your-claims/${req.params.dob}/${req.params.reference}/${req.params.claimId}/file-upload?document=${req.query.document}&eligibilityId=${req.query.eligibilityId}`)
          }
        }
      })
      .catch(function (error) {
        next(error)
      })
  })
}
