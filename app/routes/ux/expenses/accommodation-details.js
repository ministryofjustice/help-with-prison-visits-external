module.exports = function (router) {
  router.get('/accommodation-details', function (req, res) {
    return res.render('ux/expenses/accommodation-details')
  })

  router.post('/accommodation-details', function (req, res) {
    return res.redirect('claim-summary')
  })
}
