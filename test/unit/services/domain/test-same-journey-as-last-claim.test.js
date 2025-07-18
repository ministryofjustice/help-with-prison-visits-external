const SameJourneyAsLastClaim = require('../../../../app/services/domain/same-journey-as-last-claim')

describe('services/domain/same-journey-as-last-claim', () => {
  it('should construct a domain object given valid input', () => {
    const sameJourneyAsLastClaim = new SameJourneyAsLastClaim('yes')
    expect(sameJourneyAsLastClaim.sameJourneyAsLastClaim).toBe('yes')
  })

  it('should throw an error if passed invalid data', () => {
    expect(() => {
      new SameJourneyAsLastClaim(null).isValid()
    }).toThrow()
  })
})
