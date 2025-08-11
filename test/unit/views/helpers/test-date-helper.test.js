const dateFormatter = require('../../../../app/services/date-formatter')
const dateHelper = require('../../../../app/views/helpers/date-helper')

describe('views/helpers/date-helper', () => {
  it('should return string in expected format', done => {
    const DATE = dateFormatter.buildFromDateString('2016-02-01')
    const DATE_FORMATTED = 'Monday 1 February 2016'

    const result = dateHelper(DATE.toDate())

    expect(result).toBe(DATE_FORMATTED)

    done()
  })

  it('should return string in expected format when day of week does not match day of month', done => {
    const DATE = dateFormatter.buildFromDateString('2016-02-08')
    const DATE_FORMATTED = 'Monday 8 February 2016'

    const result = dateHelper(DATE.toDate())

    expect(result).toBe(DATE_FORMATTED)

    done()
  })
})
