const UrlPathValidator = require('../../../../services/validators/url-path-validator')
const HasEscort = require('../../../../services/domain/has-escort')
const ValidationError = require('../../../../services/errors/validation-error')

module.exports = function (router) {
  router.get('/apply/:claimType/eligibility/:referenceId/claim/:claimId/has-escort', function (req, res) {
    UrlPathValidator(req.params)

    return res.render('apply/eligibility/claim/has-escort', {
      claimType: req.params.claimType,
      referenceId: req.params.referenceId,
      claimId: req.params.claimId
    })
  })

  router.post('/apply/:claimType/eligibility/:referenceId/claim/:claimId/has-escort', function (req, res) {
    UrlPathValidator(req.params)

    try {
      var hasEscort = new HasEscort(req.body['has-escort'])
      if (hasEscort.hasEscort === 'yes') {
        return res.redirect(`/apply/${req.params.claimType}/eligibility/${req.params.referenceId}/claim/${req.params.claimId}/escort`)
      } else {
        return res.redirect(`/apply/${req.params.claimType}/eligibility/${req.params.referenceId}/claim/${req.params.claimId}/has-child`)
      }
    } catch (error) {
      if (error instanceof ValidationError) {
        return res.status(400).render('apply/eligibility/claim/has-escort', {
          errors: error.validationErrors,
          claimType: req.params.claimType,
          referenceId: req.params.referenceId,
          claimId: req.params.claimId
        })
      } else {
        throw error
      }
    }
  })
}
