const AboutChild = require('../../../../services/domain/about-child')
const UrlPathValidator = require('../../../../services/validators/url-path-validator')
const referenceIdHelper = require('../../../helpers/reference-id-helper')
const ValidationError = require('../../../../services/errors/validation-error')
const insertChild = require('../../../../services/data/insert-child')

const REFERENCE_SESSION_ERROR = '?error=expired'

module.exports = function (router) {
  router.get('/apply/eligibility/claim/about-child', function (req, res) {
    UrlPathValidator(req.params)

    if (!req.session ||
        !req.session.claimType ||
        !req.session.referenceId ||
        !req.session.decryptedRef ||
        !req.session.advanceOrPast ||
        !req.session.claimId) {
      return res.redirect(`/apply/first-time/new-eligibility/date-of-birth${REFERENCE_SESSION_ERROR}`)
    }

    return res.render('apply/eligibility/claim/about-child', {
      claimType: req.session.claimType,
      referenceId: req.session.referenceId,
      claimId: req.session.claimId
    })
  })

  router.post('/apply/eligibility/claim/about-child', function (req, res, next) {
    UrlPathValidator(req.params)

    if (!req.session ||
        !req.session.claimType ||
        !req.session.referenceId ||
        !req.session.advanceOrPast ||
        !req.session.claimId) {
      return res.redirect(`/apply/first-time/new-eligibility/date-of-birth${REFERENCE_SESSION_ERROR}`)
    }

    var referenceAndEligibilityId = referenceIdHelper.extractReferenceId(req.session.referenceId)

    try {
      var child = new AboutChild(
        req.body['FirstName'],
        req.body['LastName'],
        req.body['dob-day'],
        req.body['dob-month'],
        req.body['dob-year'],
        req.body['child-relationship']
      )

      insertChild(referenceAndEligibilityId.reference, referenceAndEligibilityId.id, req.session.claimId, child)
        .then(function () {
          if (req.body['add-another-child']) {
            return res.redirect(req.originalUrl)
          } else {
            return res.redirect(`/apply/eligibility/claim/expenses`)
          }
        })
        .catch(function (error) {
          next(error)
        })
    } catch (error) {
      if (error instanceof ValidationError) {
        return res.status(400).render('apply/eligibility/claim/about-child', {
          errors: error.validationErrors,
          claimType: req.session.claimType,
          referenceId: req.session.referenceId,
          claimId: req.session.claimId,
          claimant: req.body
        })
      } else {
        throw error
      }
    }
  })
}
