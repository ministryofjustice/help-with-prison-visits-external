var validator = require('../../services/validators/prisoner-relationship-validator')

module.exports = function (router) {
  router.get('/prisoner-relationship', function (req, res, next) {
    res.render('eligibility/prisoner-relationship')
    next()
  })

  router.post('/prisoner-relationship', function (req, res, next) {
    var validationErrors = validator(req.body)

    if (validationErrors) {
      res.status(400).render('eligibility/prisoner-relationship', { errors: validationErrors })
      return next()
    }

    var relationship = req.body.relationship

    if (relationship === 'Escort') {
      res.redirect('journey-assistance')
    } else if (relationship === 'None of the above') {
      res.redirect('eligibility-fail')
    } else {
      res.redirect('benefits')
    }
    next()
  })
}
