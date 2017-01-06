var expect = require('chai').expect
var decrypt = require('../../../../app/services/helpers/decrypt')

describe('services/helpers/decrypt', function () {
  it('throws error on invalid input', function () {
    try {
      decrypt('invalid value')
    } catch (err) {
      expect(err.message).to.equal('Error when decrypting value')
    }
  })
})
