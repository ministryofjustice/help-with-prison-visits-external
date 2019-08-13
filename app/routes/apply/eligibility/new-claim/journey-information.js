const UrlPathValidator = require('../../../../services/validators/url-path-validator')
const referenceIdHelper = require('../../../helpers/reference-id-helper')
const ValidationError = require('../../../../services/errors/validation-error')
const claimTypeEnum = require('../../../../constants/claim-type-enum')
const NewClaim = require('../../../../services/domain/new-claim')
const insertNewClaim = require('../../../../services/data/insert-new-claim')
const insertRepeatDuplicateClaim = require('../../../../services/data/insert-repeat-duplicate-claim')
const SessionHandler = require('../../../../services/validators/session-handler')
const visitorPrisonerCheck = require('../../../../services/data/visitor-prisoner-check')

module.exports = function (router) {
  router.get('/apply/eligibility/new-claim/journey-information', function (req, res) {
    UrlPathValidator(req.params)
    var isValidSession = SessionHandler.validateSession(req.session, req.url)

    if (!isValidSession) {
      return res.redirect(SessionHandler.getErrorPath(req.session, req.url))
    }

    return res.render('apply/eligibility/new-claim/journey-information', {
      claimType: req.session.claimType,
      referenceId: req.session.referenceId,
      advanceOrPast: req.session.advanceOrPast
    })
  })

  router.post('/apply/eligibility/new-claim/journey-information', function (req, res, next) {
    UrlPathValidator(req.params)
    var isValidSession = SessionHandler.validateSession(req.session, req.url)

    if (!isValidSession) {
      return res.redirect(SessionHandler.getErrorPath(req.session, req.url))
    }

    var referenceAndEligibilityId = referenceIdHelper.extractReferenceId(req.session.referenceId)
    var isAdvancedClaim = req.session.advanceOrPast === 'advance'

    try {
      var newClaim = new NewClaim(
        req.session.referenceId,
        req.body['date-of-journey-day'],
        req.body['date-of-journey-month'],
        req.body['date-of-journey-year'],
        isAdvancedClaim
      )

      visitorPrisonerCheck(req.body['date-of-journey-day'], req.body['date-of-journey-month'], req.body['date-of-journey-year'], referenceAndEligibilityId.id)
      .then(function (isSamePrisoner) {
        if (isSamePrisoner) {
          throw new Error('A claim has been submitted for this prisoner on the same date.')
        }

        if (!isRepeatDuplicateClaim(req.session.claimType)) {
          insertNewClaim(referenceAndEligibilityId.reference, referenceAndEligibilityId.id, req.session.claimType, newClaim)
            .then(function (claimId) {
              req.session.claimId = claimId
              return res.redirect(`/apply/eligibility/claim/has-escort`)
            })
            .catch(function (error) {
              next(error)
            })
        } else {
          insertRepeatDuplicateClaim(referenceAndEligibilityId.reference, referenceAndEligibilityId.id, newClaim)
            .then(function (claimId) {
              req.session.claimId = claimId
              return res.redirect(`/apply/eligibility/claim/summary`)
            })
            .catch(function (error) {
              next(error)
            })
        }
      })
      .catch(function (error) {
        next(error)
      })
    } catch (error) {
      if (error instanceof ValidationError) {
        return res.status(400).render('apply/eligibility/new-claim/journey-information', {
          errors: error.validationErrors,
          claimType: req.session.claimType,
          referenceId: req.session.referenceId,
          advanceOrPast: req.session.advanceOrPast,
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
