const UrlPathValidator = require('../services/validators/url-path-validator')

module.exports = function (router) {
  router.get('/application-submitted/:reference', function (req, res) {
    UrlPathValidator(req.params)
    return res.render('application-submitted', {
      reference: req.params.reference
    })
  })
}
