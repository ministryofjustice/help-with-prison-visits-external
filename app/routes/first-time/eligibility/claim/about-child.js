const UrlPathValidator = require('../../../../services/validators/url-path-validator')
const ValidationError = require('../../../../services/errors/validation-error')
const AboutChild = require('../../../../services/domain/about-child')

// TODO: Add route unit test.
module.exports = function (router) {
  router.get('/first-time/eligibility/:reference/claim/:claimId/child', function (req, res) {
    UrlPathValidator(req.params)
    return res.render('first-time/eligibility/claim/about-child', {
      reference: req.params.reference,
      claimId: req.params.claimId
    })
  })

  router.post('/first-time/eligibility/:reference/claim/:claimId/child', function (req, res) {
    UrlPathValidator(req.params)

    // TODO: Add integration test for peristance module.

    try {
      var child = new AboutChild(
        req.body['child-name'],
        req.body['dob-day'],
        req.body['dob-month'],
        req.body['dob-year'],
        req.body['child-relationship']
      )
      console.log(child) // TODO: Temp
      // TODO: Pass the claimId and domain object to the insert function to create the child record, it should be associated with the claim.
      // TODO: Only redirect if persisting the child details domain object was successful.

      if (req.body['add-another-child']) {
        return res.redirect(req.originalUrl)
      } else {
        return res.redirect(`/first-time/eligibility/${req.params.reference}/claim/${req.params.claimId}`)
      }
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
