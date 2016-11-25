const UpdatedContactDetails = require('../../../../app/services/domain/updated-contact-details')
const ValidationError = require('../../../../app/services/errors/validation-error')
const expect = require('chai').expect

describe('services/domain/update-contact-details', function () {
  it('should construct a domain object given valid input', function () {
    var updatedContactDetails = new UpdatedContactDetails('test@test.com', '')
    expect(updatedContactDetails.emailAddress).to.equal('test@test.com')
  })

  it('should throw an error if passed invalid data', function () {
    expect(function () {
      new UpdatedContactDetails('', '').isValid()
    }).to.throw(ValidationError)
  })
})
