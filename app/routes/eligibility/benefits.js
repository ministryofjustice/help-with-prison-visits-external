module.exports = function (router) {
  router.get('/benefits', function (req, res) {
    res.render('eligibility/benefits')
  })
}
