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
const encrypt = require('../../services/helpers/encrypt')
const getRequiredInformationWarnings = require('../helpers/get-required-information-warnings')
const dateFormatter = require('../../services/date-formatter')

const REFERENCE_SESSION_ERROR = '?error=expired'

module.exports = function (router) {
  router.get('/your-claims/:claimId', function (req, res, next) {
    UrlPathValidator(req.params)

    if (!req.session ||
        !req.session.dobEncoded ||
        !req.session.decryptedRef) {
      return res.redirect(`/start-already-registered${REFERENCE_SESSION_ERROR}`)
    }

    req.session.claimId = req.params.claimId
    var dobDecoded = dateFormatter.decodeDate(req.session.dobEncoded)

    getViewClaim(req.session.claimId, req.session.decryptedRef, dobDecoded)
      .then(function (claimDetails) {
        var referenceId = referenceIdHelper.getReferenceId(req.session.decryptedRef, claimDetails.claim.EligibilityId)
        var isRequestInfoPayment = claimDetails.claim.Status === 'REQUEST-INFO-PAYMENT'
        var addInformation = getRequiredInformationWarnings(claimDetails.claim.Status,
          claimDetails.claim.BenefitStatus,
          claimDetails.claim.benefitDocument[0],
          claimDetails.claim.VisitConfirmationCheck,
          claimDetails.claim.visitConfirmation,
          claimDetails.claimExpenses,
          isRequestInfoPayment)
        return res.render('your-claims/view-claim',
          {
            reference: req.session.decryptedRef,
            referenceId: referenceId,
            dob: dobDecoded,
            claimId: req.session.claimId,
            claimDetails: claimDetails,
            dateHelper: dateHelper,
            claimExpenseHelper: claimExpenseHelper,
            displayHelper: displayHelper,
            URL: req.url,
            forEdit: forEdit(claimDetails.claim.Status, claimDetails.claim.IsAdvanceClaim, claimDetails.claim.DateOfJourney, req.query.updated),
            viewClaim: true,
            claimStatusHelper: claimStatusHelper,
            claimEventHelper: claimEventHelper,
            isRequestInfoPayment: isRequestInfoPayment,
            forReview: claimDetails.claim.Status === 'NEW' || claimDetails.claim.Status === 'UPDATED' || req.query.updated,
            updated: req.query.updated,
            addInformation: addInformation
          })
      })
  })

  router.post('/your-claims/:claimId', function (req, res, next) {
    UrlPathValidator(req.params)

    if (!req.session ||
        !req.session.dobEncoded ||
        !req.session.decryptedRef) {
      return res.redirect(`/start-already-registered${REFERENCE_SESSION_ERROR}`)
    }

    var SortCode = req.body['SortCode']
    var AccountNumber = req.body['AccountNumber']
    var NameOnAccount = req.body['NameOnAccount']
    var RollNumber = req.body['RollNumber']
    var message = req.body['message-to-caseworker']
    var assistedDigitalCookie = req.cookies['apvs-assisted-digital']

    req.session.claimId = req.params.claimId

    var dobDecoded = dateFormatter.decodeDate(req.session.dobEncoded)
    var encryptedRef = encrypt(req.session.decryptedRef)

    getViewClaim(req.session.claimId, req.session.decryptedRef, dobDecoded)
      .then(function (claimDetails) {
        try {
          var benefit = claimDetails.claim.benefitDocument
          if (benefit.length <= 0) {
            benefit.push({fromInternalWeb: true})
          }

          var bankDetails = { accountNumber: AccountNumber, sortCode: SortCode, required: claimDetails.claim.Status === 'REQUEST-INFO-PAYMENT', nameOnAccount: NameOnAccount, rollNumber: RollNumber }
          var claim = new ViewClaim(claimDetails.claim.visitConfirmation.fromInternalWeb, benefit[0].fromInternalWeb, claimDetails.claimExpenses, message) // eslint-disable-line no-unused-vars
          submitUpdate(req.session.decryptedRef, claimDetails.claim.EligibilityId, req.session.claimId, message, bankDetails, assistedDigitalCookie)
            .then(function () {
              return res.redirect(`/your-claims/${req.session.claimId}?updated=true`)
            })
        } catch (error) {
          if (error instanceof ValidationError) {
            var referenceId = referenceIdHelper.getReferenceId(encryptedRef, claimDetails.claim.EligibilityId)
            var isRequestInfoPayment = bankDetails.required
            var addInformation = getRequiredInformationWarnings(claimDetails.claim.Status,
              claimDetails.claim.BenefitStatus,
              claimDetails.claim.benefitDocument[0],
              claimDetails.claim.VisitConfirmationCheck,
              claimDetails.claim.visitConfirmation,
              claimDetails.claimExpenses,
              isRequestInfoPayment)
            return res.status(400).render('your-claims/view-claim', {
              errors: error.validationErrors,
              reference: req.session.decryptedRef,
              referenceId: referenceId,
              claimId: req.session.claimId,
              claimDetails: claimDetails,
              dateHelper: dateHelper,
              dob: dobDecoded,
              claimExpenseHelper: claimExpenseHelper,
              displayHelper: displayHelper,
              URL: req.url,
              forEdit: forEdit(claimDetails.claim.Status, claimDetails.claim.IsAdvanceClaim, claimDetails.claim.DateOfJourney),
              viewClaim: true,
              claimEventHelper: claimEventHelper,
              bankDetails: { AccountNumber, SortCode, NameOnAccount, RollNumber },
              isRequestInfoPayment: isRequestInfoPayment,
              addInformation: addInformation,
              claimStatusHelper: claimStatusHelper
            })
          } else {
            next(error)
          }
        }
      })
  })

  router.get('/your-claims/:claimId/view-document/:claimDocumentId', function (req, res, next) {
    UrlPathValidator(req.params)

    if (!req.session ||
        !req.session.dobEncoded ||
        !req.session.decryptedRef) {
      return res.redirect(`/start-already-registered${REFERENCE_SESSION_ERROR}`)
    }

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

  router.post('/your-claims/:claimId/remove-document/:claimDocumentId', function (req, res, next) {
    UrlPathValidator(req.params)

    if (!req.session ||
        !req.session.dobEncoded ||
        !req.session.decryptedRef) {
      return res.redirect(`/start-already-registered${REFERENCE_SESSION_ERROR}`)
    }

    removeClaimDocument(req.params.claimDocumentId)
      .then(function () {
        if (req.query.multipage) {
          return res.redirect(`/your-claims/${req.params.claimId}`)
        } else {
          if (req.query.claimExpenseId) {
            return res.redirect(`/your-claims/${req.params.claimId}/file-upload?document=${req.query.document}&claimExpenseId=${req.query.claimExpenseId}&eligibilityId=${req.query.eligibilityId}`)
          } else {
            return res.redirect(`/your-claims/${req.params.claimId}/file-upload?document=${req.query.document}&eligibilityId=${req.query.eligibilityId}`)
          }
        }
      })
      .catch(function (error) {
        next(error)
      })
  })
}
