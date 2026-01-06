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

module.exports = router => {
  router.get('/your-claims', (req, res, next) => {
    UrlPathValidator(req.params)

    const isValidSession = SessionHandler.validateSession(req.session, req.url)

    if (!isValidSession) {
      return res.redirect(SessionHandler.getErrorPath(req.session, req.url))
    }

    const decodedDOB = dateFormatter.decodeDate(req.session.dobEncoded)

    return getHistoricClaims(
      req.session.decryptedRef,
      dateFormatter.buildFromDateString(decodedDOB).format('YYYY-MM-DD'),
    )
      .then(claims => {
        if (claims.length === 0) {
          return res.redirect(`/start-already-registered${REFERENCE_DOB_INCORRECT_ERROR}`)
        }

        return getHistoricClaimsByReference(req.session.decryptedRef).then(historicClaims => {
          const canStartNewClaim = noClaimsInProgress(historicClaims)

          return res.render('your-claims/your-claims', {
            reference: req.session.decryptedRef,
            claims: historicClaims,
            dateHelper,
            claimStatusHelper,
            canStartNewClaim,
            displayHelper,
            forEdit,
          })
        })
      })
      .catch(error => {
        next(error)
      })
  })

  function noClaimsInProgress(claims) {
    let result = true

    claims.forEach(claim => {
      if (
        claim.Status !== claimStatusEnum.APPROVED &&
        claim.Status !== claimStatusEnum.AUTOAPPROVED &&
        claim.Status !== claimStatusEnum.REJECTED &&
        claim.Status !== claimStatusEnum.APPROVED_ADVANCE_CLOSED &&
        claim.Status !== claimStatusEnum.APPROVED_PAYOUT_BARCODE_EXPIRED
      ) {
        result = false
      }
    })

    return result
  }
}
