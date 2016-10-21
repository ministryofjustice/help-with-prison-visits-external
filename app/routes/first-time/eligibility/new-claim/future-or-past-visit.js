const UrlPathValidator = require('../../../../services/validators/url-path-validator')

module.exports = function (router) {
  router.get('/first-time-claim/eligibility/:reference/new-claim', function (req, res, next) {
    console.log('in f-p')
    UrlPathValidator(req.params)
    res.render('first-time/eligibility/new-claim/future-or-past-visit', {
      reference: req.params.reference
    })
    console.log('rendered f-p')
    next()
  })

  router.post('/first-time-claim/eligibility/:reference/new-claim', function (req, res, next) {
    UrlPathValidator(req.params)
    res.redirect(`/first-time-claim/eligibility/${req.params.reference}/new-claim/past`)
    next()
  })
}
