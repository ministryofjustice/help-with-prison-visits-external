module.exports = function (router) {
  router.get('/benefits-on-behalf', function (req, res) {
    res.render('eligibility/benefits-on-behalf')
  })

  router.post('/benefits-on-behalf', function (req, res) {
    res.redirect('about-the-prisoner')
  })
}
