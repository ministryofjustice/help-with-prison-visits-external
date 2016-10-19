var devData = require('../../services/data/dev-data')

module.exports = function (router) {
  router.get('/dev/:reference', function (req, res, next) {
    devData.get(req.params.reference).then(function (data) {
      var json = JSON.stringify(data, null, '\t')
      console.log(json)
      res.render('dev/display-data-for-reference', {
        reference: req.params.reference,
        data: json
      })
      next()
    })
    .catch(function (error) {
      next(error)
    })
  })
}
