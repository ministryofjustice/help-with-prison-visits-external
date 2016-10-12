module.exports = function (router) {
  router.get('/benefits', function (req, res, next) {
    res.render('eligibility/benefits')
    next()
  })

  router.post('/benefits', function (req, res, next) {
    var benefit = req.body.benefit

    if (benefit === 'None of the above') {
      res.redirect('eligibility-fail')
    } else {
      res.redirect('benefits-on-behalf')
    }
    next()
  })
}
