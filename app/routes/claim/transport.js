module.exports = function (router) {
  router.get('/transport', function (req, res) {
    res.render('claim/transport')
  })

  router.post('/transport', function (req, res) {
    res.redirect('car-details')
  })
}
