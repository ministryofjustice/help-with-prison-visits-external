module.exports.getKeyByAttribute = function (enumeration, value, attribute) {
  let result = value
  if (!attribute) {
    attribute = 'value'
  }
  Object.keys(enumeration).forEach(function (key) {
    const element = enumeration[key]
    if (typeof element === 'object' && element[attribute] === value) {
      result = element
    }
  })
  return result
}
