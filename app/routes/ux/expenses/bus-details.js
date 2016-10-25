module.exports = function (router) {
  router.get('/bus-details', function (req, res) {
    return res.render('ux/expenses/bus-details')
  })

  router.post('/bus-details', function (req, res) {
    return res.redirect('train-details')
  })
}
