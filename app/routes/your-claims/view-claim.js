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
const AWSHelper = require('../../services/aws-helper')

const aws = new AWSHelper()

const REFERENCE_SESSION_ERROR = '?error=expired'

module.exports = router => {
  router.get('/your-claims/:claimId', (req, res, next) => {
    UrlPathValidator(req.params)

    if (!req.session || !req.session.dobEncoded || !req.session.decryptedRef) {
      return res.redirect(`/start-already-registered${REFERENCE_SESSION_ERROR}`)
    }

    req.session.claimId = req.params.claimId
    const dobDecoded = dateFormatter.decodeDate(req.session.dobEncoded)

    getViewClaim(req.session.claimId, req.session.decryptedRef, dobDecoded)
      .then(claimDetails => {
        const referenceId = referenceIdHelper.getReferenceId(req.session.decryptedRef, claimDetails.claim.EligibilityId)
        const isRequestInfoPayment = claimDetails.claim.Status === 'REQUEST-INFO-PAYMENT'
        const addInformation = getRequiredInformationWarnings(
          claimDetails.claim.Status,
          claimDetails.claim.BenefitStatus,
          claimDetails.claim.benefitDocument[0],
          claimDetails.claim.VisitConfirmationCheck,
          claimDetails.claim.visitConfirmation,
          claimDetails.claimExpenses,
          isRequestInfoPayment,
        )
        return res.render('your-claims/view-claim', {
          reference: req.session.decryptedRef,
          referenceId,
          dob: dobDecoded,
          claimId: req.session.claimId,
          claimDetails,
          dateHelper,
          claimExpenseHelper,
          displayHelper,
          URL: req.url,
          forEdit: forEdit(
            claimDetails.claim.Status,
            claimDetails.claim.IsAdvanceClaim,
            claimDetails.claim.DateOfJourney,
            req.query?.updated,
          ),
          viewClaim: true,
          claimStatusHelper,
          claimEventHelper,
          isRequestInfoPayment,
          forReview:
            claimDetails.claim.Status === 'NEW' || claimDetails.claim.Status === 'UPDATED' || req.query?.updated,
          updated: req.query?.updated,
          addInformation,
        })
      })
      .catch(error => next(error))

    return null
  })

  router.post('/your-claims/:claimId', (req, res, next) => {
    UrlPathValidator(req.params)

    if (!req.session || !req.session.dobEncoded || !req.session.decryptedRef) {
      return res.redirect(`/start-already-registered${REFERENCE_SESSION_ERROR}`)
    }

    const SortCode = req.body?.SortCode
    const AccountNumber = req.body?.AccountNumber
    const NameOnAccount = req.body?.NameOnAccount
    const RollNumber = req.body?.RollNumber
    const message = req.body?.['message-to-caseworker'] ?? ''
    const assistedDigitalCookie = req.cookies?.['apvs-assisted-digital']

    req.session.claimId = req.params.claimId

    const dobDecoded = dateFormatter.decodeDate(req.session.dobEncoded)
    const encryptedRef = encrypt(req.session.decryptedRef)
    let bankDetails

    getViewClaim(req.session.claimId, req.session.decryptedRef, dobDecoded).then(claimDetails => {
      try {
        const benefit = claimDetails.claim.benefitDocument
        if (benefit.length <= 0) {
          benefit.push({ fromInternalWeb: true })
        }

        bankDetails = {
          accountNumber: AccountNumber,
          sortCode: SortCode,
          required: claimDetails.claim.Status === 'REQUEST-INFO-PAYMENT',
          nameOnAccount: NameOnAccount,
          rollNumber: RollNumber,
        }
        // eslint-disable-next-line no-new
        new ViewClaim(
          claimDetails.claim.visitConfirmation.fromInternalWeb,
          benefit[0].fromInternalWeb,
          claimDetails.claimExpenses,
          message,
        )
        submitUpdate(
          req.session.decryptedRef,
          claimDetails.claim.EligibilityId,
          req.session.claimId,
          message,
          bankDetails,
          assistedDigitalCookie,
        ).then(() => {
          return res.redirect(`/your-claims/${req.session.claimId}?updated=true`)
        })
      } catch (error) {
        if (error instanceof ValidationError) {
          const referenceId = referenceIdHelper.getReferenceId(encryptedRef, claimDetails.claim.EligibilityId)
          const isRequestInfoPayment = bankDetails.required
          const addInformation = getRequiredInformationWarnings(
            claimDetails.claim.Status,
            claimDetails.claim.BenefitStatus,
            claimDetails.claim.benefitDocument[0],
            claimDetails.claim.VisitConfirmationCheck,
            claimDetails.claim.visitConfirmation,
            claimDetails.claimExpenses,
            isRequestInfoPayment,
          )
          return res.status(400).render('your-claims/view-claim', {
            errors: error.validationErrors,
            reference: req.session.decryptedRef,
            referenceId,
            claimId: req.session.claimId,
            claimDetails,
            dateHelper,
            dob: dobDecoded,
            claimExpenseHelper,
            displayHelper,
            URL: req.url,
            forEdit: forEdit(
              claimDetails.claim.Status,
              claimDetails.claim.IsAdvanceClaim,
              claimDetails.claim.DateOfJourney,
            ),
            viewClaim: true,
            claimEventHelper,
            bankDetails: { AccountNumber, SortCode, NameOnAccount, RollNumber },
            isRequestInfoPayment,
            addInformation,
            claimStatusHelper,
          })
        }
        next(error)
      }

      return null
    })

    return null
  })

  router.get('/your-claims/:claimId/view-document/:claimDocumentId', (req, res, next) => {
    UrlPathValidator(req.params)

    if (!req.session || !req.session.dobEncoded || !req.session.decryptedRef) {
      return res.redirect(`/start-already-registered${REFERENCE_SESSION_ERROR}`)
    }

    getClaimDocumentFilePath(req.params.claimDocumentId)
      .then(async result => {
        const path = result.Filepath
        if (path) {
          try {
            const fileName = `HwPV-Upload.${path.split('.').pop()}`
            const awsDownloadPath = await aws.download(path)
            return res.download(awsDownloadPath, fileName)
          } catch (error) {
            next(error)
          }
        } else {
          throw new Error('No path to file provided')
        }
        return null
      })
      .catch(error => {
        next(error)
      })

    return null
  })

  router.post('/your-claims/:claimId/remove-document/:claimDocumentId', (req, res, next) => {
    UrlPathValidator(req.params)

    if (!req.session || !req.session.dobEncoded || !req.session.decryptedRef) {
      return res.redirect(`/start-already-registered${REFERENCE_SESSION_ERROR}`)
    }

    removeClaimDocument(req.params.claimDocumentId)
      .then(() => {
        if (req.query?.multipage) {
          return res.redirect(`/your-claims/${req.params.claimId}`)
        }
        if (req.query?.claimExpenseId) {
          return res.redirect(
            `/your-claims/${req.params.claimId}/file-upload?document=${req.query?.document}&claimExpenseId=${req.query?.claimExpenseId}&eligibilityId=${req.query?.eligibilityId}`,
          )
        }
        return res.redirect(
          `/your-claims/${req.params.claimId}/file-upload?document=${req.query?.document}&eligibilityId=${req.query?.eligibilityId}`,
        )
      })
      .catch(error => {
        next(error)
      })

    return null
  })
}
