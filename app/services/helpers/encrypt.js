const crypto = require('crypto')
const config = require('../../../config')

var algorithm = 'aes-256-ctr'

module.exports = function (value) {
  console.log(`encrypt - value: ${value}`)
  var cipher = crypto.createCipher(algorithm, config.EXT_REFERENCE_SALT)
  console.log('cipher created')
  var crypted = cipher.update(value, 'utf8', 'hex')
  console.log('cipher updated')

  crypted += cipher.final('hex')
  console.log('crypted updated')

  return crypted
}
