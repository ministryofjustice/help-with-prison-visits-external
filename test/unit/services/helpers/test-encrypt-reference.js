const expect = require('chai').expect
const encryptReference = require('../../../../app/services/helpers/encrypt-reference')
const UNHASHED_REF = 'REFHASH'
const SALT = '2d75ed9b24a3b43dd18630a78603aa46'

describe('services/helpers/encrypt-reference', function () {
  it('should encrypt ref and generate salt', function () {
    var encrypted = encryptReference(UNHASHED_REF)
    console.dir(encrypted)

    expect(encrypted.hash).to.not.be.null
  })

  it('should encrypt ref and use specified salt', function () {
    var encrypted = encryptReference(UNHASHED_REF, SALT)

    expect(encrypted.hash).to.not.be.null
    expect(encrypted.salt).to.equal(SALT)
  })
})
