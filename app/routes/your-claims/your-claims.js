const UrlPathValidator = require('../../services/validators/url-path-validator')
const getHistoricClaims = require('../../services/data/get-historic-claims')
const getHistoricClaimsByReference = require('../../services/data/get-historic-claims-by-reference')
const dateHelper = require('../../views/helpers/date-helper')
const claimStatusEnum = require('../../constants/claim-status-enum')
const claimStatusHelper = require('../../views/helpers/claim-status-helper')
const dateFormatter = require('../../services/date-formatter')
const displayHelper = require('../../views/helpers/display-helper')
const forEdit = require('../helpers/for-edit')
const SessionHandler = require('../../services/validators/session-handler')

const REFERENCE_DOB_INCORRECT_ERROR = '?error=yes'

module.exports = function (router) {
  router.get('/your-claims', function (req, res, next) {
    UrlPathValidator(req.params)
    const isValidSession = SessionHandler.validateSession(req.session, req.url)

    if (!isValidSession) {
      return res.redirect(SessionHandler.getErrorPath(req.session, req.url))
    }

    const decodedDOB = dateFormatter.decodeDate(req.session.dobEncoded)

    getHistoricClaims(req.session.decryptedRef, dateFormatter.buildFromDateString(decodedDOB).format('YYYY-MM-DD'))
      .then(function (claims) {
        if (claims.length === 0) {
          return res.redirect(`/start-already-registered${REFERENCE_DOB_INCORRECT_ERROR}`)
        }

        getHistoricClaimsByReference(req.session.decryptedRef)
          .then(function (claims) {
            const canStartNewClaim = noClaimsInProgress(claims)

            return res.render('your-claims/your-claims', {
              reference: req.session.decryptedRef,
              claims,
              dateHelper,
              claimStatusHelper,
              canStartNewClaim,
              displayHelper,
              forEdit
            })
          })
      })
      .catch(function (error) {
        next(error)
      })
  })

  function noClaimsInProgress (claims) {
    let result = true

    claims.forEach(function (claim) {
      if (claim.Status !== claimStatusEnum.APPROVED &&
          claim.Status !== claimStatusEnum.AUTOAPPROVED &&
          claim.Status !== claimStatusEnum.REJECTED &&
          claim.Status !== claimStatusEnum.APPROVED_ADVANCE_CLOSED &&
          claim.Status !== claimStatusEnum.APPROVED_PAYOUT_BARCODE_EXPIRED) {
        result = false
      }
    })

    return result
  }
}
