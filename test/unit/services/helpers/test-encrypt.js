const expect = require('chai').expect
const encrypt = require('../../../../app/services/helpers/encrypt')

describe('services/helpers/encrypt', function () {
  it('should not throw an Error if passed a valid input', function () {
    expect(function () {
      encrypt('some value')
    }).to.not.throw(Error)
  })

  it('should throw an Error if passed invalid input', function () {
    expect(function () {
      encrypt(null)
    }).to.throw(Error)
  })
})
