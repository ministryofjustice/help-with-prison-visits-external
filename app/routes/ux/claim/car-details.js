module.exports = function (router) {
  router.get('/car-details', function (req, res) {
    return res.render('ux/claim/car-details')
  })

  router.post('/car-details', function (req, res) {
    return res.redirect('train-details')
  })
}
