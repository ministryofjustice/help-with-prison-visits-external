const benefitValidator = require('../../services/validators/eligibility/benefit-validator')
const UrlPathValidator = require('../../services/validators/url-path-validator')

module.exports = function (router) {
  router.get('/first-time/:dob/:relationship/:assistance', function (req, res, next) {
    UrlPathValidator(req.params)
    res.render('first-time/benefits', {
      dob: req.params.dob,
      relationship: req.params.relationship,
      assistance: req.params.assistance
    })
    next()
  })

  router.post('/first-time/:dob/:relationship/:assistance', function (req, res, next) {
    UrlPathValidator(req.params)

    var benefit = req.body.benefit
    var dob = req.params.dob
    var relationship = req.params.relationship
    var assistance = req.params.assistance
    var validationErrors = benefitValidator(req.body)

    if (validationErrors) {
      res.status(400).render('first-time/benefits', {
        errors: validationErrors,
        dob: dob,
        relationship: relationship,
        assistance: assistance
      })
      return next()
    }

    if (benefit === 'none') {
      res.redirect('/eligibility-fail')
    } else {
      res.redirect('/first-time' + '/' + dob + '/' + relationship + '/' + assistance + '/' + benefit)
    }
    next()
  })
}
