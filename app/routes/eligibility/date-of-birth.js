module.exports = function (router) {
  router.get('/date-of-birth', function (req, res, next) {
    res.render('eligibility/date-of-birth')
    next()
  })

  // TODO: Need age check here. If under 16 redirect to eligibility-fail. Add this to the validation logic for the page.
  router.post('/date-of-birth', function (req, res, next) {
    res.redirect('prisoner-relationship')
    next()
  })
}
