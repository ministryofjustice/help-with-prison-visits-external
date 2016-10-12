module.exports = function (router) {
  router.get('/confirm-your-details', function (req, res) {
    res.render('eligibility/confirm-your-details')
  })

  router.post('/confirm-your-details', function (req, res) {
    var detailsChanged = req.body['details-changed']

    if (detailsChanged === 'Yes') {
      res.redirect('date-of-birth')
    } else {
      res.redirect('visit-type')
    }
  })
}
