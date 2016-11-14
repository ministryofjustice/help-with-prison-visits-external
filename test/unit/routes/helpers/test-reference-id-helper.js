const expect = require('chai').expect
const referenceIdHelper = require('../../../../app/routes/helpers/reference-id-helper')

const REFERENCE = 'REFHELP'
const ID = '1234'

describe('routes/helpers/reference-id-helper', function () {
  describe('getReferenceId', function () {
    it('should return reference-id', function () {
      expect(referenceIdHelper.getReferenceId(REFERENCE, ID)).to.equal(`${REFERENCE}-${ID}`)
    })
  })
  describe('getReferenceId', function () {
    it('should return reference-id', function () {
      var result = referenceIdHelper.extractReferenceId(`${REFERENCE}-${ID}`)
      expect(result.reference).to.equal(REFERENCE)
      expect(result.id).to.equal(ID)
    })
  })
})
