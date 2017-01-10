const UrlPathValidator = require('../../services/validators/url-path-validator')
const getRepeatEligibility = require('../../services/data/get-repeat-eligibility')
const dateFormatter = require('../../services/date-formatter')
const CheckYourInformation = require('../../services/domain/check-your-information')
const ValidationError = require('../../services/errors/validation-error')
const referenceIdHelper = require('../helpers/reference-id-helper')
const displayHelper = require('../../views/helpers/display-helper')
const decrypt = require('../../services/helpers/decrypt')
const prisonsHelper = require('../../constants/helpers/prisons-helper')

module.exports = function (router) {
  router.get('/your-claims/:dob/:reference/check-your-information', function (req, res, next) {
    UrlPathValidator(req.params)

    var reference = decrypt(req.params.reference)
    getRepeatEligibility(reference, dateFormatter.buildFromDateString(req.params.dob).toDate(), null)
      .then(function (eligibility) {
        return res.render('your-claims/check-your-information', {
          dob: req.params.dob,
          reference: reference,
          encryptedReference: req.params.reference,
          eligibility: eligibility,
          displayHelper: displayHelper})
      })
      .catch(function (error) {
        next(error)
      })
  })

  router.post('/your-claims/:dob/:reference/check-your-information', function (req, res, next) {
    UrlPathValidator(req.params)

    try {
      var decryptedRef = decrypt(req.params.reference)
      new CheckYourInformation(req.body['confirm-correct']) // eslint-disable-line no-new

      var eligibilityId = req.body.EligibilityId
      var referenceId = referenceIdHelper.getReferenceId(decryptedRef, eligibilityId)

      getRepeatEligibility(decryptedRef, dateFormatter.buildFromDateString(req.params.dob).toDate(), null)
        .then(function (eligibility) {
          var nameOfPrison = eligibility.NameOfPrison
          var isNorthernIrelandClaim = prisonsHelper.isNorthernIrelandPrison(nameOfPrison)

          // Northern Ireland claims cannot be advance claims so skip future-or-past
          var nextPage = 'new-claim'
          if (isNorthernIrelandClaim) {
            nextPage = 'new-claim/same-journey-as-last-claim/past'
          }

          return res.redirect(`/apply/repeat/eligibility/${referenceId}/${nextPage}`)
        })
        .catch(function (error) {
          next(error)
        })
    } catch (error) {
      if (error instanceof ValidationError) {
        getRepeatEligibility(decryptedRef, dateFormatter.buildFromDateString(req.params.dob).toDate(), null)
          .then(function (eligibility) {
            return res.status(400).render('your-claims/check-your-information', {
              errors: error.validationErrors,
              dob: req.params.dob,
              encryptedReference: req.params.reference,
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
