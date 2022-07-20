const UrlPathValidator = require('../../services/validators/url-path-validator')
const getRepeatEligibility = require('../../services/data/get-repeat-eligibility')
const dateFormatter = require('../../services/date-formatter')
const CheckYourInformation = require('../../services/domain/check-your-information')
const ValidationError = require('../../services/errors/validation-error')
const referenceIdHelper = require('../helpers/reference-id-helper')
const displayHelper = require('../../views/helpers/display-helper')
const prisonsHelper = require('../../constants/helpers/prisons-helper')
const SessionHandler = require('../../services/validators/session-handler')

const NORTHERN_IRELAND = 'Northern Ireland'

module.exports = function (router) {
  router.get('/your-claims/check-your-information', function (req, res, next) {
    UrlPathValidator(req.params)
    const isValidSession = SessionHandler.validateSession(req.session, req.url)

    if (!isValidSession) {
      return res.redirect(SessionHandler.getErrorPath(req.session, req.url))
    }

    const dobDecoded = dateFormatter.decodeDate(req.session.dobEncoded)

    getRepeatEligibility(req.session.decryptedRef, dateFormatter.buildFromDateString(dobDecoded).format('YYYY-MM-DD'), null)
      .then(function (eligibility) {
        req.session.prisonerNumber = eligibility.PrisonNumber
        req.session.eligibilityId = eligibility.EligibilityId

        return res.render('your-claims/check-your-information', {
          dob: dobDecoded,
          reference: req.session.decryptedRef,
          eligibility,
          displayHelper
        })
      })
      .catch(function (error) {
        next(error)
      })
  })

  router.post('/your-claims/check-your-information', function (req, res, next) {
    UrlPathValidator(req.params)
    const isValidSession = SessionHandler.validateSession(req.session, req.url)

    if (!isValidSession) {
      return res.redirect(SessionHandler.getErrorPath(req.session, req.url))
    }

    let dobDecoded
    try {
      dobDecoded = dateFormatter.decodeDate(req.session.dobEncoded)

      req.session.eligibilityId = req.body.EligibilityId
      req.session.referenceId = referenceIdHelper.getReferenceId(req.session.decryptedRef, req.session.eligibilityId)

      new CheckYourInformation(req.body['confirm-correct']) // eslint-disable-line no-new

      getRepeatEligibility(req.session.decryptedRef, dateFormatter.buildFromDateString(dobDecoded).format('YYYY-MM-DD'), null)
        .then(function (eligibility) {
          const nameOfPrison = eligibility.NameOfPrison
          const isNorthernIrelandClaim = eligibility.Country === NORTHERN_IRELAND
          const isNorthernIrelandPrison = prisonsHelper.isNorthernIrelandPrison(nameOfPrison)

          req.session.prisonerNumber = eligibility.PrisonNumber
          req.session.claimType = 'repeat'

          // Northern Ireland claims cannot be advance claims so skip future-or-past
          let nextPage = 'future-or-past-visit'
          if (isNorthernIrelandClaim && isNorthernIrelandPrison) {
            req.session.advanceOrPast = 'past'
            nextPage = 'same-journey-as-last-claim'
          }

          return res.redirect(`/apply/eligibility/new-claim/${nextPage}`)
        })
        .catch(function (error) {
          next(error)
        })
    } catch (error) {
      if (error instanceof ValidationError) {
        getRepeatEligibility(req.session.decryptedRef, dateFormatter.buildFromDateString(dobDecoded).format('YYYY-MM-DD'), null)
          .then(function (eligibility) {
            return res.status(400).render('your-claims/check-your-information', {
              errors: error.validationErrors,
              dob: req.session.dobEncoded,
              reference: req.session.decryptedRef,
              eligibility,
              displayHelper
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
