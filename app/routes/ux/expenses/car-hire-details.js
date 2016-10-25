module.exports = function (router) {
  router.get('/car-hire-details', function (req, res) {
    return res.render('ux/expenses/car-hire-details')
  })

  router.post('/car-hire-details', function (req, res) {
    return res.redirect('bus-details')
  })
}
