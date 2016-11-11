const UrlPathValidator = require('../../services/validators/url-path-validator')

// TODO: Implement route.
// TODO: Unit test.
module.exports = function (router) {
  router.get('/your-claims/:dob/:reference', function (req, res) {
    UrlPathValidator(req.params)
    return res.render('your-claims/your-claims')
  })
}
