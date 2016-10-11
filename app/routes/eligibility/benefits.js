module.exports = function (router) {
  router.get('/benefits', function (req, res) {
    res.render('eligibility/benefits')
  })

  router.post('/benefits', function (req, res) {
    var benefit = req.body.benefit

    if (benefit === 'None of the above') {
      res.redirect('eligibility-fail')
    } else {
      res.redirect('benefits-on-behalf')
    }
  })
}
