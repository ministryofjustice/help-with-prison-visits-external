module.exports = function (router) {
  router.get('/train-details', function (req, res) {
    return res.render('ux/expenses/train-details')
  })

  router.post('/train-details', function (req, res) {
    return res.redirect('taxi-details')
  })
}
