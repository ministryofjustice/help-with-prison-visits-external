module.exports = function (router) {
  router.get('/plane-details', function (req, res) {
    return res.render('ux/expenses/plane-details')
  })

  router.post('/plane-details', function (req, res) {
    return res.redirect('ferry-details')
  })
}
