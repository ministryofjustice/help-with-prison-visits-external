const dateFormat = require('dateformat')
const DATE_FORMAT = 'yyyy-mm-dd'
const INVALID_DATE_ERROR = 'Invalid Date'

exports.format = function (date) {
  if (!isDate(date) && !isUndefined(date) && !isNull(date)) {
    return INVALID_DATE_ERROR
  }
  return dateFormat(date, DATE_FORMAT)
}

exports.build = function (day, month, year) {
  return new Date(year + '-' + month + '-' + day)
}

exports.buildFormatted = function (day, month, year) {
  var date = this.build(day, month, year)
  if (!isValidDate(date)) {
    return INVALID_DATE_ERROR
  }
  return this.format(date)
}

function isUndefined (date) {
  return typeof date === 'undefined'
}

function isNull (date) {
  return date === null
}

function isDate (date) {
  return date instanceof Date
}

function isValidDate (date) {
  return date.toString() !== INVALID_DATE_ERROR
}
