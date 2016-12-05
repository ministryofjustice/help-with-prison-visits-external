const UrlPathValidator = require('../../services/validators/url-path-validator')

module.exports = function (router) {
  router.get('/your-claims/:dob/:reference/:claimId', function (req, res, next) {
    UrlPathValidator(req.params)
    return res.render('your-claims/view-claim')
  })
}
