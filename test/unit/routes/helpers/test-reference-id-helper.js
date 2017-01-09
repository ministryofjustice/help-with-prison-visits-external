const expect = require('chai').expect
const referenceIdHelper = require('../../../../app/routes/helpers/reference-id-helper')
const encrypt = require('../../../../app/services/helpers/encrypt')

const REFERENCE = 'REFHELP'
const ID = '1234'
const ENCRYPTED_REFERENCEID = encrypt(`${REFERENCE}-${ID}`)

describe('routes/helpers/reference-id-helper', function () {
  describe('getReferenceId', function () {
    it('should return reference-id', function () {
      expect(referenceIdHelper.getReferenceId(REFERENCE, ID)).to.equal(ENCRYPTED_REFERENCEID)
    })
  })
  describe('getReferenceId', function () {
    it('should return reference-id', function () {
      var result = referenceIdHelper.extractReferenceId(ENCRYPTED_REFERENCEID)
      expect(result.reference).to.equal(REFERENCE)
      expect(result.id).to.equal(ID)
    })
  })
})
