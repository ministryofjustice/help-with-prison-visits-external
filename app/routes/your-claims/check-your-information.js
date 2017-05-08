const UrlPathValidator = require('../../services/validators/url-path-validator')
const getRepeatEligibility = require('../../services/data/get-repeat-eligibility')
const dateFormatter = require('../../services/date-formatter')
const CheckYourInformation = require('../../services/domain/check-your-information')
const ValidationError = require('../../services/errors/validation-error')
const referenceIdHelper = require('../helpers/reference-id-helper')
const displayHelper = require('../../views/helpers/display-helper')
const decrypt = require('../../services/helpers/decrypt')
const prisonsHelper = require('../../constants/helpers/prisons-helper')
const claimTypeEnum = require('../../constants/claim-type-enum')

const NORTHERN_IRELAND = 'Northern Ireland'
const REFERENCE_DOB_ERROR = '?error=expired'

module.exports = function (router) {
  router.get('/your-claims/check-your-information', function (req, res, next) {
    UrlPathValidator(req.params)

    if (!req.session ||
        !req.session.dobEncoded ||
        !req.session.encryptedRef) {
      return res.redirect(`/start-already-registered${REFERENCE_DOB_ERROR}`)
    }

    req.session.claimType = claimTypeEnum.REPEAT_NEW_ELIGIBILITY

    var dobEncoded = req.session.dobEncoded
    var encryptedRef = req.session.encryptedRef

    var dobDecoded = dateFormatter.decodeDate(dobEncoded)
    var reference = decrypt(encryptedRef)

    getRepeatEligibility(reference, dateFormatter.buildFromDateString(dobDecoded).toDate(), null)
      .then(function (eligibility) {
        return res.render('your-claims/check-your-information', {
          dob: dobEncoded,
          reference: reference,
          eligibility: eligibility,
          displayHelper: displayHelper})
      })
      .catch(function (error) {
        next(error)
      })
  })

  router.post('/your-claims/check-your-information', function (req, res, next) {
    UrlPathValidator(req.params)

    try {
      if (!req.session ||
          !req.session.dobEncoded ||
          !req.session.encryptedRef) {
        return res.redirect(`/start-already-registered${REFERENCE_DOB_ERROR}`)
      }

      var dobEncoded = req.session.dobEncoded
      var encryptedRef = req.session.encryptedRef

      var decryptedRef = decrypt(encryptedRef)
      var dobDecoded = dateFormatter.decodeDate(dobEncoded)

      new CheckYourInformation(req.body['confirm-correct']) // eslint-disable-line no-new

      var eligibilityId = req.body.EligibilityId
      var referenceId = referenceIdHelper.getReferenceId(decryptedRef, eligibilityId)

      req.session.claimType =

      getRepeatEligibility(decryptedRef, dateFormatter.buildFromDateString(dobDecoded).toDate(), null)
        .then(function (eligibility) {
          var nameOfPrison = eligibility.NameOfPrison
          var isNorthernIrelandClaim = eligibility.Country === NORTHERN_IRELAND
          var isNorthernIrelandPrison = prisonsHelper.isNorthernIrelandPrison(nameOfPrison)

          // Northern Ireland claims cannot be advance claims so skip future-or-past
          var nextPage = 'new-claim'
          if (isNorthernIrelandClaim && isNorthernIrelandPrison) {
            nextPage = 'new-claim/same-journey-as-last-claim/past'
          }

          return res.redirect(`/apply/repeat/eligibility/${referenceId}/${nextPage}`)
        })
        .catch(function (error) {
          next(error)
        })
    } catch (error) {
      if (error instanceof ValidationError) {
        getRepeatEligibility(decryptedRef, dateFormatter.buildFromDateString(dobDecoded).toDate(), null)
          .then(function (eligibility) {
            return res.status(400).render('your-claims/check-your-information', {
              errors: error.validationErrors,
              dob: req.params.dob,
              reference: decryptedRef,
              eligibility: eligibility,
              displayHelper: displayHelper
            })
          })
          .catch(function (error) {
            next(error)
          })
      } else {
        throw error
      }
    }
  })
}
