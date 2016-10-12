module.exports = function (router) {
  router.get('/visit-type', function (req, res) {
    res.render('claim/visit-type')
  })

  router.post('/visit-type', function (req, res) {
    res.redirect('your-journey')
  })
}
