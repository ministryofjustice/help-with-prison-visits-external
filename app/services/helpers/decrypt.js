const crypto = require('crypto')
const config = require('../../../config')

var algorithm = 'aes-256-ctr'

module.exports = function (value) {
  try {
    const iv = Buffer.alloc(16, 0)
    var decipher = crypto.createDecipheriv(algorithm, config.EXT_REFERENCE_SALT, iv)
    var dec = decipher.update(value, 'hex', 'utf8')
    dec += decipher.final('utf8')

    return dec
  } catch (err) {
    console.error(err)
    throw new Error('Error when decrypting value')
  }
}
