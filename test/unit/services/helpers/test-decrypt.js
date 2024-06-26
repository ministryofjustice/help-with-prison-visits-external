const decrypt = require('../../../../app/services/helpers/decrypt')

describe('services/helpers/decrypt', function () {
  it('throws error on invalid input', function () {
    try {
      decrypt('invalid value')
    } catch (err) {
      expect(err.message).toBe('Error when decrypting value')
    }
  })
})
