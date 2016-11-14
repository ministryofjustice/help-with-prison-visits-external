const UrlPathValidator = require('../../../../services/validators/url-path-validator')
const referenceIdHelper = require('../../../helpers/reference-id-helper')
const ValidationError = require('../../../../services/errors/validation-error')
const FirstTimeClaim = require('../../../../services/domain/first-time-claim')
const insertFirstTimeClaim = require('../../../../services/data/insert-first-time-claim')

module.exports = function (router) {
  router.get('/first-time/eligibility/:referenceId/new-claim/past', function (req, res) {
    UrlPathValidator(req.params)

    return res.render('first-time/eligibility/new-claim/journey-information', {
      referenceId: req.params.referenceId
    })
  })

  router.post('/first-time/eligibility/:referenceId/new-claim/past', function (req, res, next) {
    UrlPathValidator(req.params)
    var referenceAndEligibilityId = referenceIdHelper.extractReferenceId(req.params.referenceId)

    try {
      var firstTimeClaim = new FirstTimeClaim(
        req.params.referenceId,
        req.body['date-of-journey-day'],
        req.body['date-of-journey-month'],
        req.body['date-of-journey-year'],
        req.body['child-visitor']
      )
      insertFirstTimeClaim(referenceAndEligibilityId.reference, referenceAndEligibilityId.id, firstTimeClaim)
        .then(function (claimId) {
          if (req.body['child-visitor'] === 'yes') {
            return res.redirect(`/first-time/eligibility/${req.params.referenceId}/claim/${claimId}/child`)
          } else {
            return res.redirect(`/first-time/eligibility/${req.params.referenceId}/claim/${claimId}`)
          }
        })
        .catch(function (error) {
          next(error)
        })
    } catch (error) {
      if (error instanceof ValidationError) {
        return res.status(400).render('first-time/eligibility/new-claim/journey-information', {
          referenceId: req.params.referenceId,
          claim: req.body,
          errors: error.validationErrors
        })
      } else {
        throw error
      }
    }
  })
}
