const moment = require('moment')
const DATE_FORMAT = 'YYYY-MM-DD'
const INVALID_DATE_ERROR = 'Invalid date'

exports.format = function (date) {
  if (!isDate(date) || isUndefined(date) || isNull(date)) {
    return INVALID_DATE_ERROR
  }
  return date.format(DATE_FORMAT)
}

exports.build = function (day, month, year) {
  return moment([year, month - 1, day])
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
  return date instanceof moment
}

function isValidDate (date) {
  return date.isValid()
}
