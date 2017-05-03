const UrlPathValidator = require('../../services/validators/url-path-validator')
const getHistoricClaims = require('../../services/data/get-historic-claims')
const dateHelper = require('../../views/helpers/date-helper')
const claimStatusEnum = require('../../constants/claim-status-enum')
const claimStatusHelper = require('../../views/helpers/claim-status-helper')
const dateFormatter = require('../../services/date-formatter')
const displayHelper = require('../../views/helpers/display-helper')
const forEdit = require('../helpers/for-edit')
const decrypt = require('../../services/helpers/decrypt')

const REFERENCE_DOB_ERROR = '?error=expired'
const REFERENCE_DOB_INCORRECT_ERROR = '?error=yes'

module.exports = function (router) {
  router.get('/your-claims', function (req, res, next) {
    UrlPathValidator(req.params)

    if (!req.session ||
        !req.session.dobEncoded ||
        !req.session.encryptedRef) {
      return res.redirect(`/start-already-registered${REFERENCE_DOB_ERROR}`)
    }

    var dobEncoded = req.session.dobEncoded
    var encryptedRef = req.session.encryptedRef

    var decryptedReference = decrypt(encryptedRef)
    var decodedDOB = dateFormatter.decodeDate(dobEncoded)

    getHistoricClaims(decryptedReference, dateFormatter.buildFromDateString(decodedDOB).toDate())
      .then(function (claims) {
        if (claims.length === 0) {
          return res.redirect(`/start-already-registered${REFERENCE_DOB_INCORRECT_ERROR}`)
        }

        var canStartNewClaim = noClaimsInProgress(claims)

        return res.render('your-claims/your-claims', {
          reference: decryptedReference,
          claims: claims,
          dateHelper: dateHelper,
          claimStatusHelper: claimStatusHelper,
          canStartNewClaim: canStartNewClaim,
          displayHelper: displayHelper,
          forEdit: forEdit
        })
      })
      .catch(function (error) {
        next(error)
      })
  })

  function noClaimsInProgress (claims) {
    var result = true

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
