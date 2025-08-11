module.exports = (unmaskedValue, visibleLetterCount) => {
  const result = `${unmaskedValue.substring(0, visibleLetterCount)}${'*'.repeat(unmaskedValue.length - visibleLetterCount)}`
  return result
}
