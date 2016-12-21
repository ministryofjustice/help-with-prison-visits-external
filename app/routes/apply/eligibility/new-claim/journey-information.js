const UrlPathValidator = require('../../../../services/validators/url-path-validator')
const referenceIdHelper = require('../../../helpers/reference-id-helper')
const ValidationError = require('../../../../services/errors/validation-error')
const claimTypeEnum = require('../../../../constants/claim-type-enum')
const NewClaim = require('../../../../services/domain/new-claim')
const insertNewClaim = require('../../../../services/data/insert-new-claim')
const insertRepeatDuplicateClaim = require('../../../../services/data/insert-repeat-duplicate-claim')

module.exports = function (router) {
  router.get('/apply/:claimType/eligibility/:referenceId/new-claim/:advanceOrPast', function (req, res) {
    UrlPathValidator(req.params)

    return res.render('apply/eligibility/new-claim/journey-information', {
      claimType: req.params.claimType,
      referenceId: req.params.referenceId,
      advanceOrPast: req.params.advanceOrPast
    })
  })

  router.post('/apply/:claimType/eligibility/:referenceId/new-claim/:advanceOrPast', function (req, res, next) {
    UrlPathValidator(req.params)
    var referenceAndEligibilityId = referenceIdHelper.extractReferenceId(req.params.referenceId)
    var isAdvancedClaim = req.params.advanceOrPast === 'advance'

    try {
      var newClaim = new NewClaim(
        req.params.referenceId,
        req.body['date-of-journey-day'],
        req.body['date-of-journey-month'],
        req.body['date-of-journey-year'],
        isAdvancedClaim
      )

      if (!isRepeatDuplicateClaim(req.params.claimType)) {
        insertNewClaim(referenceAndEligibilityId.reference, referenceAndEligibilityId.id, req.params.claimType, newClaim)
          .then(function (claimId) {
            return res.redirect(`/apply/${req.params.claimType}/eligibility/${req.params.referenceId}/claim/${claimId}/has-escort`)
          })
          .catch(function (error) {
            next(error)
          })
      } else {
        insertRepeatDuplicateClaim(referenceAndEligibilityId.reference, referenceAndEligibilityId.id, newClaim)
          .then(function (claimId) {
            return res.redirect(`/apply/${req.params.claimType}/eligibility/${req.params.referenceId}/claim/${claimId}/summary`)
          })
          .catch(function (error) {
            next(error)
          })
      }
    } catch (error) {
      if (error instanceof ValidationError) {
        return res.status(400).render('apply/eligibility/new-claim/journey-information', {
          errors: error.validationErrors,
          claimType: req.params.claimType,
          referenceId: req.params.referenceId,
          advanceOrPast: req.params.advanceOrPast,
          claim: req.body
        })
      } else {
        throw error
      }
    }
  })
}

function isRepeatDuplicateClaim (claimType) {
  var isRepeatDuplicateClaim = false
  if (claimType === claimTypeEnum.REPEAT_DUPLICATE) {
    isRepeatDuplicateClaim = true
  }
  return isRepeatDuplicateClaim
}
