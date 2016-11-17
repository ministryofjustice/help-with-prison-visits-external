const UrlPathValidator = require('../../../../services/validators/url-path-validator')
const referenceIdHelper = require('../../../helpers/reference-id-helper')
const ValidationError = require('../../../../services/errors/validation-error')
const FirstTimeClaim = require('../../../../services/domain/first-time-claim')
const insertFirstTimeClaim = require('../../../../services/data/insert-first-time-claim')

module.exports = function (router) {
  router.get('/apply/:claimType/eligibility/:referenceId/new-claim/past', function (req, res) {
    UrlPathValidator(req.params)

    return res.render('apply/eligibility/new-claim/journey-information', {
      claimType: req.params.claimType,
      referenceId: req.params.referenceId
    })
  })

  router.post('/apply/:claimType/eligibility/:referenceId/new-claim/past', function (req, res, next) {
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
            return res.redirect(`/apply/${req.params.claimType}/eligibility/${req.params.referenceId}/claim/${claimId}/child`)
          } else {
            return res.redirect(`/apply/${req.params.claimType}/eligibility/${req.params.referenceId}/claim/${claimId}`)
          }
        })
        .catch(function (error) {
          next(error)
        })
    } catch (error) {
      if (error instanceof ValidationError) {
        return res.status(400).render('apply/eligibility/new-claim/journey-information', {
          errors: error.validationErrors,
          claimType: req.params.claimType,
          referenceId: req.params.referenceId,
          claim: req.body
        })
      } else {
        throw error
      }
    }
  })
}
