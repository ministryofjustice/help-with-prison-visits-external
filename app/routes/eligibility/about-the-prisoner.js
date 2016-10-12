module.exports = function (router) {
  router.get('/about-the-prisoner', function (req, res) {
    res.render('eligibility/about-the-prisoner')
  })

  router.post('/about-the-prisoner', function (req, res) {
    res.redirect('about-you')
  })
}
