const PrisonerRelationship = require('../../../../app/services/domain/prisoner-relationship')
const prisonerRelationshipEnum = require('../../../../app/constants/prisoner-relationships-enum')

describe('services/domain/prisoner-relationship', () => {
  const VALID_RELATIONSHIP = prisonerRelationshipEnum.PARTNER.urlValue
  const INVALID_RELATIONSHIP = ''

  it('should construct a domain object given valid input', () => {
    const prisonerRelationship = new PrisonerRelationship(VALID_RELATIONSHIP)
    expect(prisonerRelationship.relationship).toBe(VALID_RELATIONSHIP)
  })

  it('should throw an error if passed invalid data', () => {
    expect(() => {
      new PrisonerRelationship(INVALID_RELATIONSHIP).isValid()
    }).toThrow()
  })
})
