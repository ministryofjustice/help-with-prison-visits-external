var expect = require('chai').expect
const dateFormatter = require('../../../app/services/date-formatter')
const dateFormat = require('dateformat')
const DATE_FORMAT = 'yyyy-mm-dd'
const INVALID_DATE_ERROR = 'Invalid Date'

describe('date-formatter', function () {
  const TODAYS_DATE = dateFormat(new Date(), DATE_FORMAT)

  const VALID_DAY = 1
  const VALID_MONTH = 1
  const VALID_YEAR = 2000
  const EXPECTED_DATE = new Date(VALID_YEAR, VALID_MONTH - 1, VALID_DAY)

  const INVALID_DAY = 55
  const INVALID_MONTH = 55
  const INVALID_YEAR = 'invalid year'

  describe('format', function () {
    const DATE_1 = new Date('2016', '0', '1')
    const DATE_1_FORMATTED = '2016-01-01'

    const DATE_LEADING_ZEROES = new Date('2016', '000', '001')
    const DATE_LEADING_ZEROES_FORMATTED = '2016-01-01'

    it('should return string in expected format', function (done) {
      var result = dateFormatter.format(DATE_1)
      expect(result).to.equal(DATE_1_FORMATTED)
      done()
    })

    it('should handle leading zeroes', function (done) {
      var result = dateFormatter.format(DATE_LEADING_ZEROES)
      expect(result).to.equal(DATE_LEADING_ZEROES_FORMATTED)
      done()
    })

    it('should return todays date if passed null', function (done) {
      var result = dateFormatter.format(null)
      expect(result).to.equal(TODAYS_DATE)
      done()
    })

    it('should return todays date if passed undefined', function (done) {
      var result = dateFormatter.format(undefined)
      expect(result).to.equal(TODAYS_DATE)
      done()
    })

    it('should return INVALID_DATE_ERROR if passed anything other than a Date object', function (done) {
      var result = dateFormatter.format({})
      expect(result).to.equal(INVALID_DATE_ERROR)
      done()
    })
  })

  describe('build', function () {
    it('should return string in expected format', function (done) {
      var result = dateFormatter.build(VALID_DAY, VALID_MONTH, VALID_YEAR)
      expect(result.toString()).to.equal(EXPECTED_DATE.toString())
      done()
    })

    it('should throw error if passed null', function (done) {
      var result = dateFormatter.build(null, null, null)
      expect(result.toString()).to.equal(INVALID_DATE_ERROR)
      done()
    })

    it('should throw error if passed undefined', function (done) {
      var result = dateFormatter.build(undefined, undefined, undefined)
      expect(result.toString()).to.equal(INVALID_DATE_ERROR)
      done()
    })

    it('should return error if passed a non valid day value (1 - 31)', function (done) {
      var result = dateFormatter.build(VALID_YEAR, VALID_MONTH, INVALID_DAY)
      expect(result.toString()).to.equal(INVALID_DATE_ERROR)
      done()
    })

    it('should return error if passed a non valid month value (1 - 12)', function (done) {
      var result = dateFormatter.build(VALID_YEAR, INVALID_MONTH, VALID_DAY)
      expect(result.toString()).to.equal(INVALID_DATE_ERROR)
      done()
    })

    it('should return error if passed a non valid year value (not a number)', function (done) {
      var result = dateFormatter.build(INVALID_YEAR, VALID_MONTH, VALID_DAY)
      expect(result.toString()).to.equal(INVALID_DATE_ERROR)
      done()
    })
  })

  describe('buildFormatted', function () {
    it('should return string in expected format', function (done) {
      var result = dateFormatter.buildFormatted(VALID_DAY, VALID_MONTH, VALID_YEAR)
      expect(result.toString()).to.equal(dateFormat(EXPECTED_DATE, DATE_FORMAT))
      done()
    })

    it('should throw error if passed null', function (done) {
      var result = dateFormatter.buildFormatted(null, null, null)
      expect(result.toString()).to.equal(INVALID_DATE_ERROR)
      done()
    })

    it('should throw error if passed undefined', function (done) {
      var result = dateFormatter.buildFormatted(undefined, undefined, undefined)
      expect(result.toString()).to.equal(INVALID_DATE_ERROR)
      done()
    })

    it('should return error if passed a non valid day value (1 - 31)', function (done) {
      var result = dateFormatter.buildFormatted(VALID_YEAR, VALID_MONTH, INVALID_DAY)
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
