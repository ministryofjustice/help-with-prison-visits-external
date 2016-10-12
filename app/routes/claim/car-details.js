module.exports = function (router) {
  router.get('/car-details', function (req, res) {
    res.render('claim/car-details')
  })

  router.post('/car-details', function (req, res) {
    res.redirect('train-details')
  })
}
