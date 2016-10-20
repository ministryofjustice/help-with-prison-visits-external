const journeyAssistanceValidator = require('../../services/validators/eligibility/journey-assistance-validator')
const UrlPathValidator = require('../../services/validators/url-path-validator')

module.exports = function (router) {
  router.get('/first-time/:dob/:relationship', function (req, res, next) {
    UrlPathValidator(req.params)
    res.render('first-time/journey-assistance', {
      dob: req.params.dob,
      relationship: req.params.relationship
    })
    next()
  })

  router.post('/first-time/:dob/:relationship', function (req, res, next) {
    UrlPathValidator(req.params)

    var journeyAssistance = req.body['journey-assistance']
    var dob = req.params.dob
    var relationship = req.params.relationship

    var validationErrors = journeyAssistanceValidator(req.body)

    if (validationErrors) {
      res.status(400).render('first-time/journey-assistance', { errors: validationErrors, dob: dob, relationship: relationship })
      return next()
    }

    res.redirect('/first-time' + '/' + dob + '/' + relationship + '/' + journeyAssistance)
    next()
  })
}
