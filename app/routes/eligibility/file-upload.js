module.exports = function (router) {
  router.get('/file-upload', function (req, res) {
    res.render('eligibility/file-upload')
  })
}
