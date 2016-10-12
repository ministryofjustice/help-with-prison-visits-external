module.exports = function (router) {
  router.get('/light-refreshment-details', function (req, res) {
    res.render('claim/light-refreshment-details')
  })

  router.post('/light-refreshment-details', function (req, res) {
    res.redirect('claim-summary')
  })
}
