module.exports = function (router) {
  // TODO stub
  router.get('/first-time-claim/eligibility/:reference/new-claim/past', function (req, res) {
    return res.render('first-time/eligibility/new-claim/journey-information', {
      reference: req.params.reference
    })
  })
}
