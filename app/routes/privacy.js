module.exports = function (router) {
  router.get('/privacy', function (req, res) {
    return res.render('privacy')
  })
}
