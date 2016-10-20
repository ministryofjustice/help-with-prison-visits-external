const prisonerRelationshipValidator = require('../../services/validators/eligibility/prisoner-relationship-validator')
const UrlPathValidator = require('../../services/validators/url-path-validator')

module.exports = function (router) {
  router.get('/first-time/:dob', function (req, res, next) {
    UrlPathValidator(req.params)
    res.render('first-time/prisoner-relationship', {
      dob: req.params.dob
    })
    next()
  })

  router.post('/first-time/:dob', function (req, res, next) {
    UrlPathValidator(req.params)

    var relationship = req.body.relationship
    var dob = req.params.dob
    var validationErrors = prisonerRelationshipValidator(req.body)

    if (validationErrors) {
      res.status(400).render('first-time/prisoner-relationship', { errors: validationErrors, dob: dob })
      return next()
    }

    if (relationship === 'none') {
      res.redirect('/eligibility-fail')
    } else {
      res.redirect('/first-time' + '/' + dob + '/' + relationship)
    }
    next()
  })
}
