module.exports = function (router) {
  router.get('/additional-expenses', function (req, res) {
    res.render('claim/additional-expenses')
  })

  router.post('/additional-expenses', function (req, res) {
    res.redirect('light-refreshment-details')
  })
}
