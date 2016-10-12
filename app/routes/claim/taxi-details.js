module.exports = function (router) {
  router.get('/taxi-details', function (req, res) {
    res.render('claim/taxi-details')
  })

  router.post('/taxi-details', function (req, res) {
    res.redirect('additional-expenses')
  })
}
