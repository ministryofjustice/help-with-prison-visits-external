/* eslint-disable no-new */
const Declaration = require('../../../../app/services/domain/declaration')

let declaration

describe('services/domain/declaration', function () {
  const VALID_TERMS_AND_CONDITIONS = 'yes'

  it('should construct a domain object given valid input', function () {
    declaration = new Declaration(VALID_TERMS_AND_CONDITIONS)
    expect(declaration.termsAndConiditions).toBe(VALID_TERMS_AND_CONDITIONS)
  })

  it('should throw a ValidationError if given empty strings', function () {
    expect(function () {
      new Declaration('')
    }).toThrow()
  })
})
