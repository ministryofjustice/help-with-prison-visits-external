module.exports = function (router) {
  router.get('/prisoner-relationship', function (req, res, next) {
    res.render('eligibility/prisoner-relationship')
    next()
  })

  router.post('/prisoner-relationship', function (req, res, next) {
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
