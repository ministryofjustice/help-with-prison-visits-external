const UrlPathValidator = require('../../../services/validators/url-path-validator')
const referenceIdHelper = require('../../helpers/reference-id-helper')
const BenefitAbout = require('../../../services/domain/benefit-about')
const DateOfBirth = require('../../../services/domain/date-of-birth')
const duplicateClaimCheck = require('../../../services/data/duplicate-claim-check')
const dateFormatter = require('../../../services/date-formatter')
const ValidationError = require('../../../services/errors/validation-error')
const insertBenefitAbout = require('../../../services/data/insert-benefit-about')
const displayHelper = require('../../../views/helpers/display-helper')
const SessionHandler = require('../../../services/validators/session-handler')
const log = require('../../../services/log')

module.exports = function (router) {
  router.get('/apply/:claimType/new-eligibility/benefit-about', function (req, res) {
    UrlPathValidator(req.params)
    var isValidSession = SessionHandler.validateSession(req.session, req.url)

    log.info('Before isValidSession')

    if (!isValidSession) {
      return res.redirect(SessionHandler.getErrorPath(req.session, req.url))
    }

    log.info('After isValidSession')

    return res.render('apply/new-eligibility/benefit-about', {
      claimType: req.session.claimType,
      dob: req.session.dobEncoded,
      relationship: req.session.relationship,
      benefit: req.session.benefit,
      referenceId: req.session.referenceId
    })
  })

  router.post('/apply/:claimType/new-eligibility/benefit-about', function (req, res, next) {
    UrlPathValidator(req.params)
    var isValidSession = SessionHandler.validateSession(req.session, req.url)

    if (!isValidSession) {
      return res.redirect(SessionHandler.getErrorPath(req.session, req.url))
    }

    var benefitAbout = req.body

    try {
      var benefitAbout = new BenefitAbout(
        req.body['FirstName'],
        req.body['LastName'],
        req.body['dob-day'],
        req.body['dob-month'],
        req.body['dob-year'],
        req.body['NationalInsuranceNumber'])

      var referenceAndEligibilityId = referenceIdHelper.extractReferenceId(req.session.referenceId)

      duplicateClaimCheck(referenceAndEligibilityId.reference, referenceAndEligibilityId.id, benefitAbout.nationalInsuranceNumber)
      .then(function (isDuplicate) {
        if (isDuplicate) {
          return renderValidationError(req, res, benefitAbout, null, true)
        }

        insertBenefitAbout(referenceAndEligibilityId.reference, referenceAndEligibilityId.id, benefitAbout)
          .then(function () {
            return res.redirect(`/apply/${req.params.claimType}/new-eligibility/about-you`)
          })
      })
      .catch(function (error) {
        next(error)
      })
    } catch (error) {
      if (error instanceof ValidationError) {
        return renderValidationError(req, res, benefitAbout, error.validationErrors, false)
      } else {
        throw error
      }
    }
  })
}

function renderValidationError (req, res, benefitAbout, validationErrors, isDuplicateClaim) {
  return res.status(400).render('apply/new-eligibility/benefit-about', {
    errors: validationErrors,
    isDuplicateClaim: isDuplicateClaim,
    claimType: req.session.claimType,
    dob: req.session.dobEncoded,
    relationship: req.session.relationship,
    benefit: req.session.benefit,
    referenceId: req.session.referenceId,
    benefit: benefitAbout
  })
}
