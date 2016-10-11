module.exports = function (router) {
  router.get('/date-of-birth', function (req, res) {
    res.render('eligibility/date-of-birth')
  })
}
