module.exports = function (router) {
  router.get('/prisoner-relationship', function (req, res) {
    res.render('eligibility/prisoner-relationship')
  })

  router.post('/prisoner-relationship', function (req, res) {
    var relationship = req.body.relationship

    if (relationship === 'Other') {
      res.redirect('benefits')
    } else {
      res.redirect('journey-assistance')
    }
  })
}
