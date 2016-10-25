module.exports = function (router) {
  router.get('/taxi-details', function (req, res) {
    return res.render('ux/expenses/taxi-details')
  })

  router.post('/taxi-details', function (req, res) {
    return res.redirect('plane-details')
  })
}
