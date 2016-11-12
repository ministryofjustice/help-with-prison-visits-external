const expect = require('chai').expect
const referenceIdHelper = require('../../../../app/routes/helpers/reference-id-helper')

const reference = 'REFHELP'
const id = '1234'

describe('routes/helpers/reference-id-helper', function () {
  describe('getReferenceId', function () {
    it('should return reference-id', function () {
      expect(referenceIdHelper.getReferenceId(reference, id)).to.equal(`${reference}-${id}`)
    })
  })
  describe('getReferenceId', function () {
    it('should return reference-id', function () {
      var result = referenceIdHelper.extractReferenceId(`${reference}-${id}`)
      expect(result.reference).to.equal(reference)
      expect(result.id).to.equal(id)
    })
  })
})
