module.exports = function (router) {
  router.get('/transport', function (req, res) {
    return res.render('ux/claim/transport')
  })

  router.post('/transport', function (req, res) {
    return res.redirect('car-details')
  })
}
