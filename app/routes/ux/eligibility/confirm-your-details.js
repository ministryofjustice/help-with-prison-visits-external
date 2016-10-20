module.exports = function (router) {
  router.get('/confirm-your-details', function (req, res, next) {
    res.render('ux/eligibility/confirm-your-details')
    next()
  })

  router.post('/confirm-your-details', function (req, res, next) {
    var detailsChanged = req.body['details-changed']

    if (detailsChanged === 'Yes') {
      res.redirect('first-time')
    } else {
      res.redirect('visit-type')
    }
    next()
  })
}
