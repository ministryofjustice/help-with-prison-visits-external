const expect = require('chai').expect
const dateFormatter = require('../../../../app/services/date-formatter')
const dateHelper = require('../../../../app/views/helpers/date-helper')

describe('views/helpers/date-helper', function () {
  it('should return string in expected format', function (done) {
    const DATE = dateFormatter.buildFromDateString('2016-02-01')
    const DATE_FORMATTED = 'Monday 1 February 2016'

    var result = dateHelper(DATE.toDate())

    expect(result).to.equal(DATE_FORMATTED)

    done()
  })

  it('should return string in expected format when day of week does not match day of month', function (done) {
    const DATE = dateFormatter.buildFromDateString('2016-02-08')
    const DATE_FORMATTED = 'Monday 8 February 2016'

    var result = dateHelper(DATE.toDate())

    expect(result).to.equal(DATE_FORMATTED)

    done()
  })
})
