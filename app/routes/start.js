module.exports = function (router) {
  router.get('/start', function (req, res) {
    res.render('start')
  })

  router.post('/first-time', function (req, res) {
    res.redirect('date-of-birth')
  })

  router.post('/already-registered', function (req, res) {
    res.redirect('profile')
  })
}
