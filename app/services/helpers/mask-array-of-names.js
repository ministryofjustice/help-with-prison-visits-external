const maskString = require('./mask-string')

module.exports = function (array) {
  return array.map(function (value) {
    value.LastName = maskString(value.LastName, 1)
    return value
  })
}
