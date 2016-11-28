const UrlPathValidator = require('../../services/validators/url-path-validator')
const getRepeatEligibility = require('../../services/data/get-repeat-eligibility')
const dateFormatter = require('../../services/date-formatter')
const CheckYourInformation = require('../../services/domain/check-your-information')
const ValidationError = require('../../services/errors/validation-error')
const referenceIdHelper = require('../helpers/reference-id-helper')
const displayHelper = require('../../views/helpers/display-helper')

module.exports = function (router) {
  router.get('/your-claims/:dob/:reference/check-your-information', function (req, res, next) {
    UrlPathValidator(req.params)

    getRepeatEligibility(req.params.reference, dateFormatter.buildFromDateString(req.params.dob).toDate(), null)
      .then(function (eligibility) {
        return res.render('your-claims/check-your-information', {
          dob: req.params.dob,
          reference: req.params.reference,
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
      new CheckYourInformation(req.body['confirm-correct']) // eslint-disable-line no-new

      var eligibilityId = req.body.EligibilityId
      var referenceId = referenceIdHelper.getReferenceId(req.params.reference, eligibilityId)

      res.redirect(`/apply/repeat/eligibility/${referenceId}/new-claim`)
    } catch (error) {
      if (error instanceof ValidationError) {
        getRepeatEligibility(req.params.reference, dateFormatter.buildFromDateString(req.params.dob).toDate(), null)
          .then(function (eligibility) {
            return res.status(400).render('your-claims/check-your-information', {
              errors: error.validationErrors,
              dob: req.params.dob,
              reference: req.params.reference,
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
