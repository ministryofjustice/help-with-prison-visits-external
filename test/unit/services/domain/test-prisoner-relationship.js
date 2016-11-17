const PrisonerRelationship = require('../../../../app/services/domain/prisoner-relationship')
const ValidationError = require('../../../../app/services/errors/validation-error')
const prisonerRelationshipEnum = require('../../../../app/constants/prisoner-relationships-enum')
const expect = require('chai').expect

describe('services/domain/prisoner-relationship', function () {
  const VALID_RELATIONSHIP = prisonerRelationshipEnum.PARTNER.value
  const INVALID_RELATIONSHIP = ''

  it('should construct a domain object given valid input', function () {
    var prisonerRelationship = new PrisonerRelationship(VALID_RELATIONSHIP)
    expect(prisonerRelationship.relationship).to.equal(VALID_RELATIONSHIP)
  })

  it('should throw an error if passed invalid data', function () {
    expect(function () {
      new PrisonerRelationship(INVALID_RELATIONSHIP).isValid()
    }).to.throw(ValidationError)
  })
})
