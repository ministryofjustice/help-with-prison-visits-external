module.exports = function (router) {
  router.get('/your-journey', function (req, res) {
    return res.render('ux/claim/your-journey')
  })

  router.post('/your-journey', function (req, res) {
    return res.redirect('transport')
  })
}
