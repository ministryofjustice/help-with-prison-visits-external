const bases = require('bases')
const referenceNumber = require('../constants/reference-number-enum')

module.exports.generate = function () {
  const min = 1073741824 // 1000000
  const max = 34359738367 // VVVVVVV
  const random = Math.floor(Math.random() * (max - min) + min)
  // use Base-32 reference http://www.crockford.com/wrmg/base32.html
  return bases.toAlphabet(random, referenceNumber.VALID_CHARACTERS)
}
