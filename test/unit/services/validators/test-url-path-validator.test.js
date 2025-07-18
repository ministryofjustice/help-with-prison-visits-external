const UrlPathValidator = require('../../../../app/services/validators/url-path-validator')
const claimTypeEnum = require('../../../../app/constants/claim-type-enum')
const prisonerRelationshipEnum = require('../../../../app/constants/prisoner-relationships-enum')
const benefitsEnum = require('../../../../app/constants/benefits-enum')
const encrypt = require('../../../../app/services/helpers/encrypt')

describe('services/validators/url-path-validator', () => {
  const VALID_CLAIM_TYPE = { claimType: claimTypeEnum.FIRST_TIME }
  const INVALID_CLAIM_TYPE = { claimType: 'invalid' }

  const VALID_ENCODED_DOB = { dob: '113725122' }
  const INVALID_DOB = { dob: 'invalid' }

  const VALID_RELATIONSHIP = { relationship: prisonerRelationshipEnum.PARTNER.urlValue }
  const INVALID_RELATIONSHIP = { relationship: 'invalid' }

  const VALID_BENEFIT = { benefit: benefitsEnum.INCOME_SUPPORT.urlValue }
  const INVALID_BENEFIT = { benefit: 'invalid' }

  const VALID_REFERENCE = { reference: '49CCADM' }
  const VALID_ENCRYPTED_REFERENCE = { reference: encrypt(VALID_REFERENCE.reference) }
  const INVALID_REFERENCE = { reference: 'invalid' }

  const VALID_CLAIMID = { claimId: '123' }
  const INVALID_CLAIMID = { claimId: 'invalid' }

  const VALID_REFERENCEID = { referenceId: '49CCADM-4321' }
  const VALID_ENCRYPTED_REFERENCEID = { referenceId: encrypt(VALID_REFERENCEID.referenceId) }
  const INVALID_REFERENCEID = { referenceId: '49CCADM1XXX' }

  const VALID_CLAIM_DOCUMENT_ID = { claimId: '123' }
  const INVALID_CLAIM_DOCUMENT_ID = { claimId: 'invalid' }

  const VALID_ADVANCE_OR_PAST = { advanceOrPast: 'past' }
  const INVALID_ADVANCE_OR_PAST = { advanceOrPast: 'invalid' }

  it('should throw error if passed null', () => {
    expect(() => {
      UrlPathValidator(null)
    }).toThrow(TypeError)
  })

  it('should throw error if passed undefined', () => {
    expect(() => {
      UrlPathValidator(undefined)
    }).toThrow(TypeError)
  })

  it('should throw Error if passed an invalid claimType value', () => {
    expect(() => {
      UrlPathValidator(INVALID_CLAIM_TYPE)
    }).toThrow(Error)
  })

  it('should throw Error if passed an invalid dob value', () => {
    expect(() => {
      UrlPathValidator(INVALID_DOB)
    }).toThrow(Error)
  })

  it('should throw Error if passed an invalid relationship value', () => {
    expect(() => {
      UrlPathValidator(INVALID_RELATIONSHIP)
    }).toThrow(Error)
  })

  it('should throw Error if passed an invalid benefit value', () => {
    expect(() => {
      UrlPathValidator(INVALID_BENEFIT)
    }).toThrow(Error)
  })

  it('should throw Error if passed an invalid reference value', () => {
    expect(() => {
      UrlPathValidator(INVALID_REFERENCE)
    }).toThrow(Error)
  })

  it('should throw Error if passed an invalid claimId value', () => {
    expect(() => {
      UrlPathValidator(INVALID_CLAIMID)
    }).toThrow(Error)
  })

  it('should throw Error if passed an invalid referenceId value', () => {
    expect(() => {
      UrlPathValidator(INVALID_REFERENCEID)
    }).toThrow(Error)
  })

  it('should throw Error if passed an invalid claimDocumentId value', () => {
    expect(() => {
      UrlPathValidator(INVALID_CLAIM_DOCUMENT_ID)
    }).toThrow(Error)
  })

  it('should throw Error if passed an invalid advanceOrPast value', () => {
    expect(() => {
      UrlPathValidator(INVALID_ADVANCE_OR_PAST)
    }).toThrow(Error)
  })

  it('should return undefined if passed a valid claimType value', () => {
    const result = UrlPathValidator(VALID_CLAIM_TYPE)
    expect(result).toBeUndefined()
  })

  it('should return undefined if passed a valid dob value', () => {
    const result = UrlPathValidator(VALID_ENCODED_DOB)
    expect(result).toBeUndefined()
  })

  it('should return undefined if passed a valid relationship value', () => {
    const result = UrlPathValidator(VALID_RELATIONSHIP)
    expect(result).toBeUndefined()
  })

  it('should return undefined if passed a valid dob value', () => {
    const result = UrlPathValidator(VALID_ENCODED_DOB)
    expect(result).toBeUndefined()
  })

  it('should return undefined if passed a valid benefit value', () => {
    const result = UrlPathValidator(VALID_BENEFIT)
    expect(result).toBeUndefined()
  })

  it('should return undefined if passed a valid encrypted reference value', () => {
    const result = UrlPathValidator(VALID_ENCRYPTED_REFERENCE)
    expect(result).toBeUndefined()
  })

  it('should return undefined if passed a valid claimId value', () => {
    const result = UrlPathValidator(VALID_CLAIMID)
    expect(result).toBeUndefined()
  })

  it('should return undefined if passed a valid encrypted referenceId value', () => {
    const result = UrlPathValidator(VALID_ENCRYPTED_REFERENCEID)
    expect(result).toBeUndefined()
  })

  it('should return undefined if passed a valid claimDocumentId value', () => {
    const result = UrlPathValidator(VALID_CLAIM_DOCUMENT_ID)
    expect(result).toBeUndefined()
  })

  it('should return undefined if passed a valid advanceOrPast value', () => {
    const result = UrlPathValidator(VALID_ADVANCE_OR_PAST)
    expect(result).toBeUndefined()
  })
})
