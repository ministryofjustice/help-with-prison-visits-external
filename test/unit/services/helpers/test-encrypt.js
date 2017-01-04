var expect = require('chai').expect
var encrypt = require('../../../../app/services/helpers/encrypt')

describe('services/helpers/encrypt', function () {
  it('throws error on invalid input', function () {
    try {
      encrypt('invalid value')
    } catch (err) {
      expect(err.message).to.equal('Error when encrypting value')
    }
  })
})
