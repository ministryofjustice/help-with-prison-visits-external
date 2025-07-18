const referenceIdHelper = require('../../../../app/routes/helpers/reference-id-helper')
const encrypt = require('../../../../app/services/helpers/encrypt')

const REFERENCE = 'REFHELP'
const ID = '1234'
const ENCRYPTED_REFERENCEID = encrypt(`${REFERENCE}-${ID}`)

describe('routes/helpers/reference-id-helper', () => {
  describe('getReferenceId', () => {
    it('should return reference-id', () => {
      expect(referenceIdHelper.getReferenceId(REFERENCE, ID)).toBe(ENCRYPTED_REFERENCEID)
    })
  })
  describe('getReferenceId', () => {
    it('should return reference-id', () => {
      const result = referenceIdHelper.extractReferenceId(ENCRYPTED_REFERENCEID)
      expect(result.reference).toBe(REFERENCE)
      expect(result.id).toBe(ID)
    })
  })
})
