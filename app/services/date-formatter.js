const dateFormat = require('dateformat')
const DATE_FORMAT = 'yyyy-mm-dd'

exports.format = function (date) {
  return dateFormat(date, DATE_FORMAT)
}

exports.build = function (day, month, year) {
  return new Date(year + '-' + month + '-' + day)
}

exports.buildFormatted = function (day, month, year) {
  return this.format(this.build(day, month, year))
}
