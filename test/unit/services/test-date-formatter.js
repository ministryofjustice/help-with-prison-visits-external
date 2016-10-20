const expect = require('chai').expect
const dateFormatter = require('../../../app/services/date-formatter')
const moment = require('moment')
const DATE_FORMAT = 'YYYY-MM-DD'
const INVALID_DATE_ERROR = 'Invalid date'

describe('services/date-formatter', function () {
  const VALID_DAY = '01'
  const VALID_MONTH = '01'
  const VALID_YEAR = '2000'
  const EXPECTED_DATE = moment([VALID_YEAR, VALID_MONTH, VALID_DAY], DATE_FORMAT)

  const INVALID_DAY = '55'
  const INVALID_MONTH = '55'
  const INVALID_YEAR = 'invalid year'

  describe('format', function () {
    const DATE_1 = moment('2016-01-01', DATE_FORMAT)
    const DATE_1_FORMATTED = '2016-01-01'

    it('should return string in expected format', function (done) {
      var result = dateFormatter.format(DATE_1)
      expect(result).to.equal(DATE_1_FORMATTED)
      done()
    })

    it('should return error if passed null', function (done) {
      var result = dateFormatter.format(null)
      expect(result).to.equal(INVALID_DATE_ERROR)
      done()
    })

    it('should return error if passed undefined', function (done) {
      var result = dateFormatter.format(undefined)
      expect(result).to.equal(INVALID_DATE_ERROR)
      done()
    })

    it('should return error if passed anything other than a Date object', function (done) {
      var result = dateFormatter.format({})
      expect(result).to.equal(INVALID_DATE_ERROR)
      done()
    })
  })

  describe('build', function () {
    it('should return string in expected format', function (done) {
      var result = dateFormatter.build(VALID_DAY, VALID_MONTH, VALID_YEAR)
      expect(result.format(DATE_FORMAT)).to.equal(EXPECTED_DATE.format(DATE_FORMAT))
      done()
    })

    it('should return error if passed null', function (done) {
      var result = dateFormatter.build(null, null, null)
      expect(result.toString()).to.equal(INVALID_DATE_ERROR)
      done()
    })

    it('should return error if passed undefined', function (done) {
      var result = dateFormatter.build(undefined, undefined, undefined)
      expect(result.toString()).to.equal(INVALID_DATE_ERROR)
      done()
    })

    it('should return error if passed a non valid day value (1 - 31)', function (done) {
      var result = dateFormatter.build(INVALID_DAY, VALID_MONTH, VALID_YEAR)
      expect(result.toString()).to.equal(INVALID_DATE_ERROR)
      done()
    })

    it('should return error if passed a non valid month value (1 - 12)', function (done) {
      var result = dateFormatter.build(VALID_DAY, INVALID_MONTH, VALID_YEAR)
      expect(result.toString()).to.equal(INVALID_DATE_ERROR)
      done()
    })

    it('should return error if passed a non valid year value (not a number)', function (done) {
      var result = dateFormatter.build(VALID_DAY, VALID_MONTH, INVALID_YEAR)
      expect(result.toString()).to.equal(INVALID_DATE_ERROR)
      done()
    })
  })

  describe('buildFormatted', function () {
    it('should return string in expected format', function (done) {
      var result = dateFormatter.buildFormatted(VALID_DAY, VALID_MONTH, VALID_YEAR)
      expect(result.toString()).to.equal(dateFormatter.format(EXPECTED_DATE, DATE_FORMAT))
      done()
    })

    it('should return error if passed null', function (done) {
      var result = dateFormatter.buildFormatted(null, null, null)
      expect(result.toString()).to.equal(INVALID_DATE_ERROR)
      done()
    })

    it('should return error if passed undefined', function (done) {
      var result = dateFormatter.buildFormatted(undefined, undefined, undefined)
      expect(result.toString()).to.equal(INVALID_DATE_ERROR)
      done()
    })

    it('should return error if passed a non valid day value (1 - 31)', function (done) {
      var result = dateFormatter.buildFormatted(VALID_YEAR, VALID_MONTH, INVALID_DAY)
      expect(result.toString()).to.equal(INVALID_DATE_ERROR)
      done()
    })

    it('should return error if passed a day greater than 29 in February', function (done) {
      var result = dateFormatter.buildFormatted(VALID_YEAR, '02', '31')
      expect(result.toString()).to.equal(INVALID_DATE_ERROR)
      done()
    })

    it('should return error if passed a non valid month value (1 - 12)', function (done) {
      var result = dateFormatter.buildFormatted(VALID_YEAR, INVALID_MONTH, VALID_DAY)
      expect(result.toString()).to.equal(INVALID_DATE_ERROR)
      done()
    })

    it('should return error if passed a non valid year value (not a number)', function (done) {
      var result = dateFormatter.buildFormatted(INVALID_YEAR, VALID_MONTH, VALID_DAY)
      expect(result.toString()).to.equal(INVALID_DATE_ERROR)
      done()
    })
  })
})
