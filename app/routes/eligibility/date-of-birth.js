module.exports = function (router) {
  router.get('/date-of-birth', function (req, res) {
    res.render('eligibility/date-of-birth')
  })


  // TODO: Need age check here. If under 16 redirect to eligibility-fail.

}
