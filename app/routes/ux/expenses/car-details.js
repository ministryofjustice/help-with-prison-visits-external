module.exports = function (router) {
  // TODO: Replace the subbed 'to' and 'from' values with real values associated with this claim.
  router.get('/car-details', function (req, res) {
    return res.render('ux/expenses/car-details', {
      from: 'London',
      to: 'Hewell'
    })
  })

  router.post('/car-details', function (req, res) {
    return res.redirect('car-hire-details')
  })
}
