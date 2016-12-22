const UrlPathValidator = require('../../../../services/validators/url-path-validator')
const HasChild = require('../../../../services/domain/has-child')
const ValidationError = require('../../../../services/errors/validation-error')

module.exports = function (router) {
  router.get('/apply/:claimType/eligibility/:referenceId/claim/:claimId/has-child', function (req, res) {
    UrlPathValidator(req.params)

    return res.render('apply/eligibility/claim/has-child', {
      claimType: req.params.claimType,
      referenceId: req.params.referenceId,
      claimId: req.params.claimId
    })
  })

  router.post('/apply/:claimType/eligibility/:referenceId/claim/:claimId/has-child', function (req, res) {
    UrlPathValidator(req.params)

    try {
      var hasChild = new HasChild(req.body['has-child'])
      if (hasChild.hasChild === 'yes') {
        return res.redirect(`/apply/${req.params.claimType}/eligibility/${req.params.referenceId}/claim/${req.params.claimId}/child`)
      } else {
        return res.redirect(`/apply/${req.params.claimType}/eligibility/${req.params.referenceId}/claim/${req.params.claimId}`)
      }
    } catch (error) {
      if (error instanceof ValidationError) {
        return res.status(400).render('apply/eligibility/claim/has-child', {
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
