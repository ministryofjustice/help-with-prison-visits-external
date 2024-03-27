const referenceGenerator = require('../../../app/services/reference-generator')

describe('services/reference-generator', function () {
  it('should generate a random 7 digit base 32 string', function () {
    const reference1 = referenceGenerator.generate()
    const reference2 = referenceGenerator.generate()

    expect(reference1.length).toBe(7)
    expect(reference1).toMatch(/[0-9A-Z]{7}/)
    expect(reference1).not.toBe(reference2)
  })
})
