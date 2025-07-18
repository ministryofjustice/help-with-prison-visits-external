const moment = require('moment')

const DATE_FORMAT = 'YYYY-MM-DD'
const DATE_ENCODE_FORMAT = 'YYYYMMDD'
const INVALID_DATE_ERROR = 'Invalid date'
const bases = require('bases')

const format = date => {
  if (!isDate(date) || isUndefined(date) || isNull(date)) {
    return INVALID_DATE_ERROR
  }
  return date.format(DATE_FORMAT)
}
exports.format = format

exports.now = () => {
  const now = moment()
  return applyDST(now)
}

const build = (day, month, year) => {
  month -= 1
  const date = moment([year, month, day])
  return applyDST(date)
}
exports.build = build

exports.buildFormatted = (day, month, year) => {
  const date = build(day, month, year)
  if (!isValidDate(date)) {
    return INVALID_DATE_ERROR
  }
  return format(date)
}

exports.buildFromDateString = date => {
  if (typeof date !== 'string') {
    return false
  }
  const dateSplit = date.split('-')
  const year = dateSplit[0]
  const month = dateSplit[1]
  const day = dateSplit[2]

  return build(day, month, year)
}

exports.encodeDate = date => {
  return bases.toBase8(date.format(DATE_ENCODE_FORMAT))
}

exports.decodeDate = encodedDate => {
  const date = moment(bases.fromBase(encodedDate, 8), DATE_ENCODE_FORMAT)
  const formattedDate = format(date)
  return formattedDate
}

function applyDST(date) {
  if (date.isDST()) {
    date = date.add(1, 'hour')
  }
  return date
}

function isUndefined(date) {
  return typeof date === 'undefined'
}

function isNull(date) {
  return date === null
}

function isDate(date) {
  return date instanceof moment
}

function isValidDate(date) {
  return date.isValid()
}
