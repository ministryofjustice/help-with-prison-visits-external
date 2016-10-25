module.exports = function (router) {
  router.get('/ferry-details', function (req, res) {
    return res.render('ux/expenses/ferry-details')
  })

  router.post('/ferry-details', function (req, res) {
    return res.redirect('light-refreshment-details')
  })
}
