module.exports = function (router) {
  router.get('/first-time-claim/eligibility/:reference/claim/:claim/summary', function (req, res) {
    return res.render('ux/claim/claim-details')
  })
}
