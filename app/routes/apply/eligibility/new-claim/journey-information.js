const UrlPathValidator = require('../../../../services/validators/url-path-validator')
const referenceIdHelper = require('../../../helpers/reference-id-helper')
const ValidationError = require('../../../../services/errors/validation-error')
const claimTypeEnum = require('../../../../constants/claim-type-enum')
const NewClaim = require('../../../../services/domain/new-claim')
const insertNewClaim = require('../../../../services/data/insert-new-claim')
const insertRepeatDuplicateClaim = require('../../../../services/data/insert-repeat-duplicate-claim')

module.exports = function (router) {
  router.get('/apply/:claimType/eligibility/:referenceId/new-claim/past', function (req, res) {
    UrlPathValidator(req.params)

    return res.render('apply/eligibility/new-claim/journey-information', {
      claimType: req.params.claimType,
      referenceId: req.params.referenceId,
      isRepeatDuplicateClaim: isRepeatDuplicateClaim(req.params.claimType)
    })
  })

  router.post('/apply/:claimType/eligibility/:referenceId/new-claim/past', function (req, res, next) {
    UrlPathValidator(req.params)
    var referenceAndEligibilityId = referenceIdHelper.extractReferenceId(req.params.referenceId)
    var repeatDuplicateClaim = isRepeatDuplicateClaim(req.params.claimType)

    try {
      var newClaim = new NewClaim(
        req.params.referenceId,
        req.body['date-of-journey-day'],
        req.body['date-of-journey-month'],
        req.body['date-of-journey-year'],
        req.body['child-visitor'],
        repeatDuplicateClaim
      )

      if (!repeatDuplicateClaim) {
        insertNewClaim(referenceAndEligibilityId.reference, referenceAndEligibilityId.id, newClaim)
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
          isRepeatDuplicateClaim: repeatDuplicateClaim,
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
