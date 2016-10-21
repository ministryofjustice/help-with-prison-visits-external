module.exports = function (router) {
  router.get('/application-submitted/:reference', function (req, res) {
    return res.render('application-submitted', {
      reference: req.params.reference
    })
  })
}
