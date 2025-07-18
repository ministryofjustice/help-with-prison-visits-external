const maskString = require('./mask-string')

module.exports = array => {
  return array.map(value => {
    value.LastName = maskString(value.LastName, 1)
    return value
  })
}
