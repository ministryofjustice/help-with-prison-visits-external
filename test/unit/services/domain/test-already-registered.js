const AlreadyRegisterd = require('../../../../app/services/domain/already-registered')
const dateFormatter = require('../../../../app/services/date-formatter')
const expect = require('chai').expect

describe('services/domain/already-registered', function () {
  const VALID_REFERNCE = 'APVS123'
  const VALID_DAY = '15'
  const VALID_MONTH = '05'
  const VALID_YEAR = '1988'
  const VALID_DOB = '1988-05-15'
  const INVALID_REFERNCE = 'some invalid reference'

  it('should construct a domain object given valid input', function () {
    const alreadyRegistered = new AlreadyRegisterd(
      VALID_REFERNCE,
      VALID_DAY,
      VALID_MONTH,
      VALID_YEAR
    )
    expect(alreadyRegistered.reference).to.equal(VALID_REFERNCE)
    expect(alreadyRegistered.dob).to.deep.equal(dateFormatter.build(VALID_DAY, VALID_MONTH, VALID_YEAR))
    expect(alreadyRegistered.dobEncoded).to.deep.equal(dateFormatter.encodeDate(dateFormatter.buildFromDateString(VALID_DOB)))
  })

  it('should throw an error if passed invalid data', function () {
    expect(function () {
      new AlreadyRegisterd(
        INVALID_REFERNCE,
        VALID_DAY,
        VALID_MONTH,
        VALID_YEAR
      ).isValid()
    }).to.throw()
  })
})
