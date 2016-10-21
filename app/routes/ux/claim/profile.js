module.exports = function (router) {
  router.get('/profile', function (req, res) {
    return res.render('ux/claim/profile')
  })

  router.post('/profile', function (req, res) {
    return res.redirect('confirm-your-details')
  })
}
