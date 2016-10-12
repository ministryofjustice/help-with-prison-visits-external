module.exports = function (router) {
  router.get('/confirm-your-details', function (req, res, next) {
    res.render('eligibility/confirm-your-details')
    next()
  })

  router.post('/confirm-your-details', function (req, res, next) {
    var detailsChanged = req.body['details-changed']

    if (detailsChanged === 'Yes') {
      res.redirect('date-of-birth')
    } else {
      res.redirect('visit-type')
    }
    next()
  })
}
