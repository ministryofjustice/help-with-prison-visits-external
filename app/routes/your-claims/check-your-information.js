const UrlPathValidator = require('../../services/validators/url-path-validator')
const getRepeatEligibility = require('../../services/data/get-repeat-eligibility')
const dateFormatter = require('../../services/date-formatter')
const CheckYourInformation = require('../../services/domain/check-your-information')
const ValidationError = require('../../services/errors/validation-error')
const referenceIdHelper = require('../helpers/reference-id-helper')
const displayHelper = require('../../views/helpers/display-helper')
const decrypt = require('../../services/helpers/decrypt')
const prisonsHelper = require('../../constants/helpers/prisons-helper')

const NORTHERN_IRELAND = 'Northern Ireland'
const REFERENCE_DOB_ERROR = '?error=expired'

module.exports = function (router) {
  router.get('/your-claims/check-your-information', function (req, res, next) {
    UrlPathValidator(req.params)

    if (!req.session ||
        !req.session.dobEncoded ||
        !req.session.decryptedRef) {
      return res.redirect(`/start-already-registered${REFERENCE_DOB_ERROR}`)
    }

    var dobDecoded = dateFormatter.decodeDate(req.session.dobEncoded)

    getRepeatEligibility(req.session.decryptedRef, dateFormatter.buildFromDateString(dobDecoded).toDate(), null)
      .then(function (eligibility) {
        req.session.prisonerNumber = eligibility['PrisonNumber']

        return res.render('your-claims/check-your-information', {
          dob: dobDecoded,
          reference: req.session.decryptedRef,
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
          !req.session.decryptedRef) {
        return res.redirect(`/start-already-registered${REFERENCE_DOB_ERROR}`)
      }

      var dobDecoded = dateFormatter.decodeDate(req.session.dobEncoded)

      new CheckYourInformation(req.body['confirm-correct']) // eslint-disable-line no-new

      var eligibilityId = req.body.EligibilityId
      req.session.referenceId = referenceIdHelper.getReferenceId(req.session.decryptedRef, eligibilityId)

      getRepeatEligibility(req.session.decryptedRef, dateFormatter.buildFromDateString(dobDecoded).toDate(), null)
        .then(function (eligibility) {
          var nameOfPrison = eligibility.NameOfPrison
          var isNorthernIrelandClaim = eligibility.Country === NORTHERN_IRELAND
          var isNorthernIrelandPrison = prisonsHelper.isNorthernIrelandPrison(nameOfPrison)

          req.session.prisonerNumber = eligibility['PrisonNumber']

          // Northern Ireland claims cannot be advance claims so skip future-or-past
          var nextPage = 'future-or-past-visit'
          if (isNorthernIrelandClaim && isNorthernIrelandPrison) {
            req.session.advanceOrPast = 'past'
            nextPage = 'same-journey-as-last-claim'
          }

          return res.redirect(`/apply/repeat/eligibility/new-claim/${nextPage}`)
        })
        .catch(function (error) {
          next(error)
        })
    } catch (error) {
      if (error instanceof ValidationError) {
        getRepeatEligibility(req.session.decryptedRef, dateFormatter.buildFromDateString(req.session.dobDecoded).toDate(), null)
          .then(function (eligibility) {
            req.session.prisonerNumber = eligibility['PrisonNumber']

            return res.status(400).render('your-claims/check-your-information', {
              errors: error.validationErrors,
              dob: req.session.dobDecoded,
              reference: req.session.decryptedRef,
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
