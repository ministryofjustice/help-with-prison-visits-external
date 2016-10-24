module.exports = function (router) {
  router.get('/file-upload', function (req, res) {
    return res.render('ux/file-upload')
  })

  router.post('/file-upload', function (req, res) {
    return res.redirect('claim-details')
  })
}
