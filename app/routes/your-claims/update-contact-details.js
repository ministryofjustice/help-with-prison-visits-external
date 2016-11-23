const UrlPathValidator = require('../../services/validators/url-path-validator')

module.exports = function (router) {
  router.get('/your-claims/:dob/:reference/update-contact-details', function (req, res) {
    UrlPathValidator(req.params)
    return res.render('your-claims/update-contact-details', {
      dob: req.params.dob,
      reference: req.params.reference
    })
  })

  router.post('/your-claims/:dob/:reference/update-contact-details', function (req, res) {
    UrlPathValidator(req.params)
    return res.render('your-claims/update-contact-details', {
      dob: req.params.dob,
      reference: req.params.reference
    })
  })
}
