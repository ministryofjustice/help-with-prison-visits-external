const crypto = require('crypto')
const config = require('../../../config')

const algorithm = 'aes-256-ctr'

module.exports = value => {
  try {
    const iv = Buffer.alloc(16, 0)
    const cipher = crypto.createCipheriv(algorithm, config.EXT_REFERENCE_SALT, iv)
    let crypted = cipher.update(value, 'utf8', 'hex')
    crypted += cipher.final('hex')

    return crypted
    // eslint-disable-next-line no-unused-vars
  } catch (err) {
    throw new Error('Error when encrypting value')
  }
}
