module.exports = function (router) {
  router.get('/taxi-details', function (req, res) {
    return res.render('ux/claim/taxi-details')
  })

  router.post('/taxi-details', function (req, res) {
    return res.redirect('additional-expenses')
  })
}
