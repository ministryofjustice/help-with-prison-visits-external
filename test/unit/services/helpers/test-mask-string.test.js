const maskString = require('../../../../app/services/helpers/mask-string')

describe('services/helpers/mask-string', () => {
  it('should return the masked input string', () => {
    const maskedString = maskString('some value', 5)
    expect(maskedString).toBe('some *****')
  })
})
