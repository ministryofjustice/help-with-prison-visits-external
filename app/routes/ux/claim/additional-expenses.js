module.exports = function (router) {
  router.get('/additional-expenses', function (req, res) {
    return res.render('ux/claim/additional-expenses')
  })

  router.post('/additional-expenses', function (req, res) {
    return res.redirect('light-refreshment-details')
  })
}
