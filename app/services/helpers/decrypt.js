const crypto = require('crypto')
const config = require('../../../config')

var algorithm = 'aes-256-ctr'

module.exports = function (value) {
  console.log(`decrypt - value: ${value}`)
  var decipher = crypto.createDecipher(algorithm, config.EXT_REFERENCE_SALT)
  var dec = decipher.update(value, 'hex', 'utf8')
  dec += decipher.final('utf8')

  return dec
}
