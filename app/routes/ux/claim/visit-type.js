module.exports = function (router) {
  router.get('/visit-type', function (req, res) {
    return res.render('ux/claim/visit-type')
  })

  router.post('/visit-type', function (req, res) {
    return res.redirect('your-journey')
  })
}
