const UrlPathValidator = require('../../../../services/validators/url-path-validator')
const HasEscort = require('../../../../services/domain/has-escort')
const ValidationError = require('../../../../services/errors/validation-error')
const getIsAdvanceClaim = require('../../../../services/data/get-is-advance-claim')

const REFERENCE_SESSION_ERROR = '?error=expired'

module.exports = function (router) {
  router.get('/apply/eligibility/claim/has-escort', function (req, res) {
    UrlPathValidator(req.params)

    if (!req.session ||
        !req.session.claimType ||
        !req.session.referenceId ||
        !req.session.decryptedRef ||
        !req.session.advanceOrPast ||
        !req.session.claimId) {
      return res.redirect(`/apply/first-time/new-eligibility/date-of-birth${REFERENCE_SESSION_ERROR}`)
    }

    getIsAdvanceClaim(req.session.claimId)
      .then(function (isAdvanceClaim) {
        return res.render('apply/eligibility/claim/has-escort', {
          claimType: req.session.claimType,
          referenceId: req.session.referenceId,
          claimId: req.session.claimId,
          isAdvanceClaim: isAdvanceClaim
        })
      })
  })

  router.post('/apply/eligibility/claim/has-escort', function (req, res) {
    UrlPathValidator(req.params)

    if (!req.session ||
        !req.session.claimType ||
        !req.session.referenceId ||
        !req.session.decryptedRef ||
        !req.session.advanceOrPast ||
        !req.session.claimId) {
      return res.redirect(`/apply/first-time/new-eligibility/date-of-birth${REFERENCE_SESSION_ERROR}`)
    }

    try {
      var hasEscort = new HasEscort(req.body['has-escort'])
      if (hasEscort.hasEscort === 'yes') {
        return res.redirect(`/apply/eligibility/claim/about-escort`)
      } else {
        return res.redirect(`/apply/eligibility/claim/has-child`)
      }
    } catch (error) {
      if (error instanceof ValidationError) {
        getIsAdvanceClaim(req.session.claimId)
          .then(function (isAdvanceClaim) {
            return res.status(400).render('apply/eligibility/claim/has-escort', {
              errors: error.validationErrors,
              claimType: req.session.claimType,
              referenceId: req.session.referenceId,
              claimId: req.session.claimId,
              isAdvanceClaim: isAdvanceClaim
            })
          })
      } else {
        throw error
      }
    }
  })
}
