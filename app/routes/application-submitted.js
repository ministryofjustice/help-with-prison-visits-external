module.exports = function (router) {
  router.get('/application-submitted/:reference', function (req, res, next) {
    res.render('application-submitted', {reference: req.params.reference})
    next()
  })
}
