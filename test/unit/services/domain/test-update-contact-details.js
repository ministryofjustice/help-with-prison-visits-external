const UpdateContactDetails = require('../../../../app/services/domain/update-contact-details')
const ValidationError = require('../../../../app/services/errors/validation-error')
const expect = require('chai').expect

describe('services/domain/update-contact-details', function () {
  it('should construct a domain object given valid input', function () {
    var updateContactDetails = new UpdateContactDetails('test@test.com', '')
    expect(updateContactDetails.emailAddress).to.equal('test@test.com')
  })

  it('should throw an error if passed invalid data', function () {
    expect(function () {
      new UpdateContactDetails('', '').isValid()
    }).to.throw(ValidationError)
  })
})
