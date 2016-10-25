module.exports = function (router) {
  router.get('/first-time/eligibility/:reference/claim/:claimId', function (req, res) {
    console.log('GET /first-time/eligibility/:reference/claim/:claimId')
    return res.render('ux/claim/claim-summary')
  })

  router.post('/first-time/eligibility/:reference/claim/:claimId', function (req, res) {
    console.log('POST /first-time/eligibility/:reference/claim/:claimId')
    return res.redirect('/bank-account-details')
  })
}
