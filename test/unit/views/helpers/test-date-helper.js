const expect = require('chai').expect
const moment = require('moment')

const dateHelper = require('../../../../app/views/helpers/date-helper')

describe('views/helpers/date-helper', function () {
  it('should return string in expected format', function (done) {
    const DATE_FORMAT = 'YYYY-MM-DD'
    const DATE = moment('2016-02-01', DATE_FORMAT)
    const DATE_FORMATTED = 'Mon 1st February 2016'

    var result = dateHelper(DATE.toDate())

    expect(result).to.equal(DATE_FORMATTED)

    done()
  })

  it('should return string in expected format when day of week does not match day of month', function (done) {
    const DATE_FORMAT = 'YYYY-MM-DD'
    const DATE = moment('2016-02-08', DATE_FORMAT)
    const DATE_FORMATTED = 'Mon 8th February 2016'

    var result = dateHelper(DATE.toDate())

    expect(result).to.equal(DATE_FORMATTED)

    done()
  })
})
