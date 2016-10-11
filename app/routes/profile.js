module.exports = function (router) {
  router.get('/profile', function (req, res) {
    res.render('profile')
  })
}
