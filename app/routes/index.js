module.exports = function (router) {
  router.get('/', function (req, res) {
    return res.render('index', {
      title: 'APVS index'
    })
  })
}
