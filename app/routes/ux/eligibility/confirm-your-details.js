module.exports = function (router) {
  router.get('/confirm-your-details', function (req, res) {
    return res.render('ux/eligibility/confirm-your-details')
  })

  router.post('/confirm-your-details', function (req, res) {
    if (req.body['details-changed'] === 'Yes') {
      return res.redirect('first-time')
    } else {
      return res.redirect('visit-type')
    }
  })
}
