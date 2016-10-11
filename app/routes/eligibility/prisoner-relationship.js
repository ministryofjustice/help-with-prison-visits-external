module.exports = function (router) {
  router.get('/prisoner-relationship', function (req, res) {
    res.render('eligibility/prisoner-relationship')
  })
}
