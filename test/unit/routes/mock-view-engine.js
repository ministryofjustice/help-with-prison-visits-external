const path = require('path')

const viewEngine = function (app, viewsPath) {
  app.engine('html', function (filePath, options, callback) {
    const rendered = `${filePath}: ${JSON.stringify(options)}`
    return callback(null, rendered)
  })
  app.set('view engine', 'html')
  app.set('views', [path.join(__dirname, viewsPath), path.join(__dirname, '../../../lib/')])
}

exports.default = viewEngine
module.exports = exports.default
