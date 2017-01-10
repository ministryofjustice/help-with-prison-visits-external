const AboutChild = require('../../../../services/domain/about-child')
const UrlPathValidator = require('../../../../services/validators/url-path-validator')
const referenceIdHelper = require('../../../helpers/reference-id-helper')
const ValidationError = require('../../../../services/errors/validation-error')
const insertChild = require('../../../../services/data/insert-child')

module.exports = function (router) {
  router.get('/apply/:claimType/eligibility/:referenceId/claim/:claimId/child', function (req, res) {
    UrlPathValidator(req.params)

    return res.render('apply/eligibility/claim/about-child', {
      claimType: req.params.claimType,
      referenceId: req.params.referenceId,
      claimId: req.params.claimId
    })
  })

  router.post('/apply/:claimType/eligibility/:referenceId/claim/:claimId/child', function (req, res, next) {
    UrlPathValidator(req.params)
    var referenceAndEligibilityId = referenceIdHelper.extractReferenceId(req.params.referenceId)

    try {
      var child = new AboutChild(
        req.body['first-name'],
        req.body['last-name'],
        req.body['dob-day'],
        req.body['dob-month'],
        req.body['dob-year'],
        req.body['child-relationship']
      )

      insertChild(referenceAndEligibilityId.reference, referenceAndEligibilityId.id, req.params.claimId, child)
        .then(function () {
          if (req.body['add-another-child']) {
            return res.redirect(req.originalUrl)
          } else {
            return res.redirect(`/apply/${req.params.claimType}/eligibility/${req.params.referenceId}/claim/${req.params.claimId}`)
          }
        })
        .catch(function (error) {
          next(error)
        })
    } catch (error) {
      if (error instanceof ValidationError) {
        return res.status(400).render('apply/eligibility/claim/about-child', {
          errors: error.validationErrors,
          claimType: req.params.claimType,
          referenceId: req.params.referenceId,
          claimId: req.params.claimId,
          claimant: req.body
        })
      } else {
        throw error
      }
    }
  })
}
