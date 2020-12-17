const crypto = require('crypto')
const config = require('../../../config')

const algorithm = 'aes-256-ctr'

module.exports = function (value) {
  try {
    const iv = Buffer.alloc(16, 0)
    const decipher = crypto.createDecipheriv(algorithm, config.EXT_REFERENCE_SALT, iv)
    let dec = decipher.update(value, 'hex', 'utf8')
    dec += decipher.final('utf8')

    return dec
  } catch (err) {
    console.error(err)
    throw new Error('Error when decrypting value')
  }
}
