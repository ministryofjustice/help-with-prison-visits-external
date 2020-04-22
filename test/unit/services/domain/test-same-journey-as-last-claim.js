const SameJourneyAsLastClaim = require('../../../../app/services/domain/same-journey-as-last-claim')
const expect = require('chai').expect

describe('services/domain/same-journey-as-last-claim', function () {
  it('should construct a domain object given valid input', function () {
    var sameJourneyAsLastClaim = new SameJourneyAsLastClaim('yes')
    expect(sameJourneyAsLastClaim.sameJourneyAsLastClaim).to.equal('yes')
  })

  it('should throw an error if passed invalid data', function () {
    expect(function () {
      new SameJourneyAsLastClaim(null).isValid()
    }).to.throw()
  })
})
