const UrlPathValidator = require('../../../../services/validators/url-path-validator')
const HasChild = require('../../../../services/domain/has-child')
const ValidationError = require('../../../../services/errors/validation-error')

const REFERENCE_SESSION_ERROR = '?error=expired'

module.exports = function (router) {
  router.get('/apply/eligibility/claim/has-child', function (req, res) {
    UrlPathValidator(req.params)

    if (!req.session ||
        !req.session.claimType ||
        !req.session.referenceId ||
        !req.session.decryptedRef ||
        !req.session.advanceOrPast ||
        !req.session.claimId) {
      return res.redirect(`/apply/first-time/new-eligibility/date-of-birth${REFERENCE_SESSION_ERROR}`)
    }

    return res.render('apply/eligibility/claim/has-child', {
      claimType: req.session.claimType,
      referenceId: req.session.referenceId,
      claimId: req.session.claimId
    })
  })

  router.post('/apply/eligibility/claim/has-child', function (req, res) {
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
      var hasChild = new HasChild(req.body['has-child'])
      if (hasChild.hasChild === 'yes') {
        return res.redirect(`/apply/eligibility/claim/about-child`)
      } else {
        return res.redirect(`/apply/eligibility/claim/expenses`)
      }
    } catch (error) {
      if (error instanceof ValidationError) {
        return res.status(400).render('apply/eligibility/claim/has-child', {
          errors: error.validationErrors,
          claimType: req.session.claimType,
          referenceId: req.session.referenceId,
          claimId: req.session.claimId
        })
      } else {
        throw error
      }
    }
  })
}
