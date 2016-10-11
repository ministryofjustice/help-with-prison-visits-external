module.exports = function (router) {
  router.get('/date-of-birth', function (req, res) {
    console.log('here')
    res.render('eligibility/date-of-birth')
  })
}
