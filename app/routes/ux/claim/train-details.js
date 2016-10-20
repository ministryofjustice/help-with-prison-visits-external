module.exports = function (router) {
  router.get('/train-details', function (req, res, next) {
    res.render('ux/claim/train-details')
    next()
  })

  router.post('/train-details', function (req, res, next) {
    res.redirect('taxi-details')
    next()
  })
}
