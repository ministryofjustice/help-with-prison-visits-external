var expect = require('chai').expect
var referenceGenerator = require('../../../app/services/reference-generator')

describe('reference-generator', function () {
  it('should generate a random 7 digit base 32 string', function () {
    var reference1 = referenceGenerator.generate()
    var reference2 = referenceGenerator.generate()

    expect(reference1.length).to.equal(7)
    expect(reference1).to.match(/[0-9A-Z]{7}/)
    expect(reference1).to.not.equal(reference2)
  })
})
