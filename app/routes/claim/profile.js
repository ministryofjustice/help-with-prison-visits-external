module.exports = function (router) {
  router.get('/profile', function (req, res) {
    res.render('claim/profile')
  })

  router.post('/profile', function (req, res) {
    res.redirect('confirm-your-details')
  })
}
