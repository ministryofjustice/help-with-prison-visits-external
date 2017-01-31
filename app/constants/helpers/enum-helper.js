module.exports.getKeyByAttribute = function (enumeration, value, attribute) {
  var result = value
  if (!attribute) {
    attribute = 'value'
  }
  Object.keys(enumeration).forEach(function (key) {
    var element = enumeration[key]
    if (typeof element === 'object' && element[attribute] === value) {
      result = element
    }
  })
  return result
}
