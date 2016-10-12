module.exports = function (router) {
  router.get('/train-details', function (req, res) {
    res.render('claim/train-details')
  })

  router.post('/train-details', function (req, res) {
    res.redirect('taxi-details')
  })
}
