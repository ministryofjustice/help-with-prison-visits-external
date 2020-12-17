const expect = require('chai').expect
const dateFormatter = require('../../../app/services/date-formatter')
const moment = require('moment')
const bases = require('bases')
const DATE_FORMAT = 'YYYY-MM-DD'
const INVALID_DATE_ERROR = 'Invalid date'

describe('services/date-formatter', function () {
  const VALID_DAY = '01'
  const VALID_MONTH = '01'
  const VALID_YEAR = '2000'
  const EXPECTED_DATE = moment([VALID_YEAR, VALID_MONTH, VALID_DAY], DATE_FORMAT)
  const ENCODED_DATE = bases.toBase8(EXPECTED_DATE.format('YYYYMMDD'))

  const INVALID_DAY = '55'
  const INVALID_MONTH = '55'
  const INVALID_YEAR = 'invalid year'

  describe('format', function () {
    const DATE_1 = moment('2016-01-01', DATE_FORMAT)
    const DATE_1_FORMATTED = '2016-01-01'

    it('should return string in expected format', function () {
      const result = dateFormatter.format(DATE_1)
      expect(result).to.equal(DATE_1_FORMATTED)
    })

    it('should return error if passed null', function () {
      const result = dateFormatter.format(null)
      expect(result).to.equal(INVALID_DATE_ERROR)
    })

    it('should return error if passed undefined', function () {
      const result = dateFormatter.format(undefined)
      expect(result).to.equal(INVALID_DATE_ERROR)
    })

    it('should return error if passed anything other than a Date object', function () {
      const result = dateFormatter.format({})
      expect(result).to.equal(INVALID_DATE_ERROR)
    })
  })

  describe('build', function () {
    it('should return string in expected format', function () {
      const result = dateFormatter.build(VALID_DAY, VALID_MONTH, VALID_YEAR)
      expect(result.format(DATE_FORMAT)).to.equal(EXPECTED_DATE.format(DATE_FORMAT))
    })

    it('should return error if passed null', function () {
      const result = dateFormatter.build(null, null, null)
      expect(result.toString()).to.equal(INVALID_DATE_ERROR)
    })

    it('should return error if passed undefined', function () {
      const result = dateFormatter.build(undefined, undefined, undefined)
      expect(result.toString()).to.equal(INVALID_DATE_ERROR)
    })

    it('should return error if passed a non valid day value (1 - 31)', function () {
      const result = dateFormatter.build(INVALID_DAY, VALID_MONTH, VALID_YEAR)
      expect(result.toString()).to.equal(INVALID_DATE_ERROR)
    })

    it('should return error if passed a non valid month value (1 - 12)', function () {
      const result = dateFormatter.build(VALID_DAY, INVALID_MONTH, VALID_YEAR)
      expect(result.toString()).to.equal(INVALID_DATE_ERROR)
    })

    it('should return error if passed a non valid year value (not a number)', function () {
      const result = dateFormatter.build(VALID_DAY, VALID_MONTH, INVALID_YEAR)
      expect(result.toString()).to.equal(INVALID_DATE_ERROR)
    })
  })

  describe('buildFormatted', function () {
    it('should return string in expected format', function () {
      const result = dateFormatter.buildFormatted(VALID_DAY, VALID_MONTH, VALID_YEAR)
      expect(result.toString()).to.equal(dateFormatter.format(EXPECTED_DATE, DATE_FORMAT))
    })

    it('should return error if passed null', function () {
      const result = dateFormatter.buildFormatted(null, null, null)
      expect(result.toString()).to.equal(INVALID_DATE_ERROR)
    })

    it('should return error if passed undefined', function () {
      const result = dateFormatter.buildFormatted(undefined, undefined, undefined)
      expect(result.toString()).to.equal(INVALID_DATE_ERROR)
    })

    it('should return error if passed a non valid day value (1 - 31)', function () {
      const result = dateFormatter.buildFormatted(VALID_YEAR, VALID_MONTH, INVALID_DAY)
      expect(result.toString()).to.equal(INVALID_DATE_ERROR)
    })

    it('should return error if passed a day greater than 29 in February', function () {
      const result = dateFormatter.buildFormatted(VALID_YEAR, '02', '31')
      expect(result.toString()).to.equal(INVALID_DATE_ERROR)
    })

    it('should return error if passed a non valid month value (1 - 12)', function () {
      const result = dateFormatter.buildFormatted(VALID_YEAR, INVALID_MONTH, VALID_DAY)
      expect(result.toString()).to.equal(INVALID_DATE_ERROR)
    })

    it('should return error if passed a non valid year value (not a number)', function () {
      const result = dateFormatter.buildFormatted(INVALID_YEAR, VALID_MONTH, VALID_DAY)
      expect(result.toString()).to.equal(INVALID_DATE_ERROR)
    })
  })

  describe('encodeDate', function () {
    it('should return string in expected format', function () {
      const result = dateFormatter.encodeDate(EXPECTED_DATE)
      expect(result).to.equal(ENCODED_DATE)
    })

    it('should return error if passed null', function () {
      const result = dateFormatter.buildFormatted(null)
      expect(result.toString()).to.equal(INVALID_DATE_ERROR)
    })

    it('should return error if passed undefined', function () {
      const result = dateFormatter.buildFormatted(undefined)
      expect(result.toString()).to.equal(INVALID_DATE_ERROR)
    })

    it('should return error if passed anything other than a moment object', function () {
      const result = dateFormatter.buildFormatted({})
      expect(result.toString()).to.equal(INVALID_DATE_ERROR)
    })
  })

  describe('decodeDate', function () {
    const DECODED_DATE = '2000-01-01'

    it('should return string in expected format', function () {
      const result = dateFormatter.decodeDate(ENCODED_DATE)
      expect(result).to.equal(DECODED_DATE)
    })

    it('should return error if passed anything not an encoded date', function () {
      const result = dateFormatter.buildFormatted({})
      expect(result.toString()).to.equal(INVALID_DATE_ERROR)
    })
  })
})
