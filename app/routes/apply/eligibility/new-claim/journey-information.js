const UrlPathValidator = require('../../../../services/validators/url-path-validator')
const referenceIdHelper = require('../../../helpers/reference-id-helper')
const ValidationError = require('../../../../services/errors/validation-error')
const claimTypeEnum = require('../../../../constants/claim-type-enum')
const NewClaim = require('../../../../services/domain/new-claim')
const insertNewClaim = require('../../../../services/data/insert-new-claim')
const insertRepeatDuplicateClaim = require('../../../../services/data/insert-repeat-duplicate-claim')
const SessionHandler = require('../../../../services/validators/session-handler')
const getReleaseDate = require('../../../../services/data/get-release-date')

module.exports = router => {
  router.get('/apply/eligibility/new-claim/journey-information', (req, res) => {
    UrlPathValidator(req.params)
    const isValidSession = SessionHandler.validateSession(req.session, req.url)

    if (!isValidSession) {
      return res.redirect(SessionHandler.getErrorPath(req.session, req.url))
    }

    return res.render('apply/eligibility/new-claim/journey-information', {
      claimType: req.session.claimType,
      referenceId: req.session.referenceId,
      advanceOrPast: req.session.advanceOrPast,
    })
  })

  router.post('/apply/eligibility/new-claim/journey-information', (req, res, next) => {
    UrlPathValidator(req.params)
    const isValidSession = SessionHandler.validateSession(req.session, req.url)

    if (!isValidSession) {
      return res.redirect(SessionHandler.getErrorPath(req.session, req.url))
    }

    const referenceAndEligibilityId = referenceIdHelper.extractReferenceId(req.session.referenceId)
    const isAdvancedClaim = req.session.advanceOrPast === 'advance'

    try {
      return getReleaseDate(referenceAndEligibilityId.id)
        .then(results => {
          let releaseDateIsSet
          let releaseDate
          if (results.length > 0) {
            releaseDateIsSet = results[0].ReleaseDateIsSet
            releaseDate = results[0].ReleaseDate
          }
          const newClaim = new NewClaim(
            req.session.referenceId,
            req.body?.['date-of-journey-day'] ?? '',
            req.body?.['date-of-journey-month'] ?? '',
            req.body?.['date-of-journey-year'] ?? '',
            isAdvancedClaim,
            releaseDateIsSet,
            releaseDate,
          )

          if (!isRepeatDuplicateClaim(req.session.claimType)) {
            insertNewClaim(
              referenceAndEligibilityId.reference,
              referenceAndEligibilityId.id,
              req.session.claimType,
              newClaim,
            )
              .then(claimId => {
                req.session.claimId = claimId
                return res.redirect('/apply/eligibility/claim/has-escort')
              })
              .catch(error => {
                next(error)
              })
          } else {
            insertRepeatDuplicateClaim(referenceAndEligibilityId.reference, referenceAndEligibilityId.id, newClaim)
              .then(claimId => {
                req.session.claimId = claimId
                return res.redirect('/apply/eligibility/claim/summary')
              })
              .catch(error => {
                next(error)
              })
          }
        })
        .catch(error => {
          if (error instanceof ValidationError) {
            return res.status(400).render('apply/eligibility/new-claim/journey-information', {
              errors: error.validationErrors,
              claimType: req.session.claimType,
              referenceId: req.session.referenceId,
              advanceOrPast: req.session.advanceOrPast,
              claim: req.body ?? {},
            })
          }
          throw error
        })
    } catch (error) {
      if (error instanceof ValidationError) {
        return res.status(400).render('apply/eligibility/new-claim/journey-information', {
          errors: error.validationErrors,
          claimType: req.session.claimType,
          referenceId: req.session.referenceId,
          advanceOrPast: req.session.advanceOrPast,
          claim: req.body ?? {},
        })
      }
      throw error
    }
  })
}

function isRepeatDuplicateClaim(claimType) {
  return claimType === claimTypeEnum.REPEAT_DUPLICATE
}
