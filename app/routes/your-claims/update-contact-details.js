const UrlPathValidator = require('../../services/validators/url-path-validator')
const UpdateContactDetails = require('../../services/domain/update-contact-details')
const ValidationError = require('../../services/errors/validation-error')

module.exports = function (router) {
  router.get('/your-claims/:dob/:reference/update-contact-details', function (req, res) {
    UrlPathValidator(req.params)
    return res.render('your-claims/update-contact-details', {
      dob: req.params.dob,
      reference: req.params.reference,
      eligibilityId: req.query.eligibility
    })
  })

  router.post('/your-claims/:dob/:reference/update-contact-details', function (req, res) {
    UrlPathValidator(req.params)

    try {
      var updatedContactDetails = new UpdateContactDetails(req.body['email-address'], req.body['phone-number'])
      console.dir(updatedContactDetails)
      res.redirect(`/your-claims/${req.params.dob}/${req.params.reference}/check-your-information`)
    } catch (error) {
      if (error instanceof ValidationError) {
        return res.render('your-claims/update-contact-details', {
          errors: error.validationErrors,
          dob: req.params.dob,
          reference: req.params.reference,
          eligibilityId: req.params.EligibilityId
        })
      }
    }
  })
}
