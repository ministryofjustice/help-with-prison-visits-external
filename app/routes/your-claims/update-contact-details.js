const UrlPathValidator = require('../../services/validators/url-path-validator')
const UpdatedContactDetails = require('../../services/domain/updated-contact-details')
const ValidationError = require('../../services/errors/validation-error')
const insertEligibilityVisitorUpdatedContactDetail = require('../../services/data/insert-eligibility-visitor-updated-contact-detail')

const REFERENCE_SESSION_ERROR = '?error=expired'

module.exports = function (router) {
  router.get('/your-claims/update-contact-details', function (req, res) {
    UrlPathValidator(req.params)

    if (!req.session ||
        !req.session.dobEncoded ||
        !req.session.decryptedRef ||
        !req.session.prisonerNumber ||
        !req.session.eligibilityId) {
      return res.redirect(`/start-already-registered${REFERENCE_SESSION_ERROR}`)
    }

    return res.render('your-claims/update-contact-details', {
      eligibilityId: req.session.eligibilityId
    })
  })

  router.post('/your-claims/update-contact-details', function (req, res, next) {
    UrlPathValidator(req.params)

    if (!req.session ||
        !req.session.dobEncoded ||
        !req.session.decryptedRef ||
        !req.session.prisonerNumber ||
        !req.session.eligibilityId) {
      return res.redirect(`/start-already-registered${REFERENCE_SESSION_ERROR}`)
    }

    try {
      var updatedContactDetails = new UpdatedContactDetails(req.body['email-address'], req.body['phone-number'])
      insertEligibilityVisitorUpdatedContactDetail(req.session.decryptedRef, req.session.eligibilityId, updatedContactDetails)
        .then(function () {
          res.redirect(`/your-claims/check-your-information`)
        })
        .catch(function (error) {
          next(error)
        })
    } catch (error) {
      if (error instanceof ValidationError) {
        return res.status(400).render('your-claims/update-contact-details', {
          errors: error.validationErrors,
          eligibilityId: req.session.eligibilityId,
          contactDetails: req.body
        })
      } else {
        throw error
      }
    }
  })
}
