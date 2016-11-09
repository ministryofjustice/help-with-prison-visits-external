const AboutChild = require('../../../../services/domain/about-child')
const UrlPathValidator = require('../../../../services/validators/url-path-validator')
const ValidationError = require('../../../../services/errors/validation-error')
const insertChild = require('../../../../services/data/insert-child')

// TODO: Add route unit test.
module.exports = function (router) {
  router.get('/first-time/eligibility/:reference/claim/:claimId/child', function (req, res) {
    UrlPathValidator(req.params)
    return res.render('first-time/eligibility/claim/about-child', {
      reference: req.params.reference,
      claimId: req.params.claimId
    })
  })

  router.post('/first-time/eligibility/:reference/claim/:claimId/child', function (req, res, next) {
    UrlPathValidator(req.params)

    try {
      var child = new AboutChild(
        req.body['child-name'],
        req.body['dob-day'],
        req.body['dob-month'],
        req.body['dob-year'],
        req.body['child-relationship']
      )

      insertChild(req.params.claimId, child)
        .then(function () {
          if (req.body['add-another-child']) {
            return res.redirect(req.originalUrl)
          } else {
            return res.redirect(`/first-time/eligibility/${req.params.reference}/claim/${req.params.claimId}`)
          }
        })
        .catch(function (error) {
          next(error)
        })
    } catch (error) {
      if (error instanceof ValidationError) {
        return res.status(400).render('first-time/eligibility/claim/about-child', {
          errors: error.validationErrors,
          reference: req.params.reference,
          claimId: req.params.claimId,
          claimant: req.body
        })
      } else {
        throw error
      }
    }
  })
}
