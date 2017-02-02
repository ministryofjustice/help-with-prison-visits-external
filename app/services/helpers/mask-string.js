module.exports = function (unmaskedValue, visibleLetterCount) {
  var result = `${unmaskedValue.substring(0, visibleLetterCount)}${'*'.repeat(unmaskedValue.length - visibleLetterCount)}`
  return result
}
