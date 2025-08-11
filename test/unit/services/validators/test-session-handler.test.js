const SessionHandler = require('../../../../app/services/validators/session-handler')
const claimTypeEnum = require('../../../../app/constants/claim-type-enum')
const prisonerRelationshipEnum = require('../../../../app/constants/prisoner-relationships-enum')
const benefitsEnum = require('../../../../app/constants/benefits-enum')

const VALID_ENCODED_DOB = '113725122'
const VALID_RELATIONSHIP = prisonerRelationshipEnum.PARTNER.urlValue
const VALID_BENEFIT = benefitsEnum.INCOME_SUPPORT.urlValue
const VALID_BENEFIT_OWNER = 'yes'
const VALID_REFERENCE_ID = '49CCADM-4321'
const VALID_REFERENCE = '49CCADM'
const VALID_CLAIM_TYPE = claimTypeEnum.FIRST_TIME
const VALID_ADVANCE_OR_PAST = 'past'
const VALID_CLAIMID = '123'

const NULL_ENCODED_DOB = null
const NULL_RELATIONSHIP = null
const NULL_BENEFIT = null
const NULL_BENEFIT_OWNER = null
const NULL_REFERENCE_ID = null
const NULL_REFERENCE = null
const NULL_CLAIM_TYPE = null
const NULL_ADVANCE_OR_PAST = null
const NULL_CLAIMID = null

const INVALID_ENCODED_DOB = 'invalid'
const INVALID_RELATIONSHIP = 'invalid'
const INVALID_BENEFIT = 'invalid'
const INVALID_REFERENCE_ID = '49CCADM1XXX'
const INVALID_REFERENCE = 'invalid'
const INVALID_CLAIM_TYPE = 'invalid'
const INVALID_ADVANCE_OR_PAST = 'invalid'
const INVALID_CLAIMID = 'invalid'

describe('services/validators/session-handler validateSession', () => {
  describe('date-of-birth Session', () => {
    const VALID_ENCODED_DOB_SESSION = { dobEncoded: VALID_ENCODED_DOB }
    const NULL_ENCODED_DOB_SESSION = { dobEncoded: NULL_ENCODED_DOB }
    const INVALID_ENCODED_DOB_SESSION = { dobEncoded: INVALID_ENCODED_DOB }
    const VALID_ENCODED_DOB_SESSION_URL = '/apply/first-time/new-eligibility/prisoner-relationship'

    it('should return true if passed a valid dobEncoded value', () => {
      const result = SessionHandler.validateSession(VALID_ENCODED_DOB_SESSION, VALID_ENCODED_DOB_SESSION_URL)
      expect(result).toBe(true)
    })

    it('should return false if passed a null dobEncoded value', () => {
      const result = SessionHandler.validateSession(NULL_ENCODED_DOB_SESSION, VALID_ENCODED_DOB_SESSION_URL)
      expect(result).toBe(false)
    })

    it('should throw Error if passed an invalid dob value', () => {
      expect(() => {
        SessionHandler.validateSession(INVALID_ENCODED_DOB_SESSION, VALID_ENCODED_DOB_SESSION_URL)
      }).toThrow(Error)
    })
  })

  describe('prisoner-relationship Session', () => {
    const VALID_RELATIONSHIP_SESSION = {
      dobEncoded: VALID_ENCODED_DOB,
      relationship: VALID_RELATIONSHIP,
    }
    const NULL_RELATIONSHIP_SESSION = {
      dobEncoded: VALID_ENCODED_DOB,
      relationship: NULL_RELATIONSHIP,
    }
    const INVALID_RELATIONSHIP_SESSION = {
      dobEncoded: VALID_ENCODED_DOB,
      relationship: INVALID_RELATIONSHIP,
    }
    const VALID_RELATIONSHIP_SESSION_URL = '/apply/first-time/new-eligibility/benefits'

    it('should return true if passed a valid relationship value', () => {
      const result = SessionHandler.validateSession(VALID_RELATIONSHIP_SESSION, VALID_RELATIONSHIP_SESSION_URL)
      expect(result).toBe(true)
    })

    it('should return false if passed a null relationship value', () => {
      const result = SessionHandler.validateSession(NULL_RELATIONSHIP_SESSION, VALID_RELATIONSHIP_SESSION_URL)
      expect(result).toBe(false)
    })

    it('should throw Error if passed an invalid relationship value', () => {
      expect(() => {
        SessionHandler.validateSession(INVALID_RELATIONSHIP_SESSION, VALID_RELATIONSHIP_SESSION_URL)
      }).toThrow(Error)
    })
  })

  describe('benefit Session', () => {
    const VALID_BENEFIT_SESSION = {
      dobEncoded: VALID_ENCODED_DOB,
      relationship: VALID_RELATIONSHIP,
      benefit: VALID_BENEFIT,
      benefitOwner: VALID_BENEFIT_OWNER,
    }
    const NULL_BENEFIT_SESSION = {
      dobEncoded: VALID_ENCODED_DOB,
      relationship: VALID_RELATIONSHIP,
      benefit: NULL_BENEFIT,
      benefitOwner: NULL_BENEFIT_OWNER,
    }
    const INVALID_BENEFIT_SESSION = {
      dobEncoded: VALID_ENCODED_DOB,
      relationship: VALID_RELATIONSHIP,
      benefit: INVALID_BENEFIT,
      benefitOwner: VALID_BENEFIT_OWNER,
    }
    const VALID_BENEFIT_SESSION_URL = '/apply/first-time/new-eligibility/about-the-prisoner'

    it('should return true if passed a valid benefit value', () => {
      const result = SessionHandler.validateSession(VALID_BENEFIT_SESSION, VALID_BENEFIT_SESSION_URL)
      expect(result).toBe(true)
    })

    it('should return false if passed a null benefit value', () => {
      const result = SessionHandler.validateSession(NULL_BENEFIT_SESSION, VALID_BENEFIT_SESSION_URL)
      expect(result).toBe(false)
    })

    it('should throw Error if passed an invalid benefit value', () => {
      expect(() => {
        SessionHandler.validateSession(INVALID_BENEFIT_SESSION, VALID_BENEFIT_SESSION_URL)
      }).toThrow(Error)
    })
  })

  describe('about-the-prisoner Session', () => {
    const VALID_PRISONER_SESSION = {
      dobEncoded: VALID_ENCODED_DOB,
      relationship: VALID_RELATIONSHIP,
      benefit: VALID_BENEFIT,
      benefitOwner: VALID_BENEFIT_OWNER,
      referenceId: VALID_REFERENCE_ID,
      decryptedRef: VALID_REFERENCE,
    }
    const NULL_PRISONER_SESSION = {
      dobEncoded: VALID_ENCODED_DOB,
      relationship: VALID_RELATIONSHIP,
      benefit: VALID_BENEFIT,
      benefitOwner: NULL_BENEFIT_OWNER,
      referenceId: NULL_REFERENCE_ID,
      decryptedRef: NULL_REFERENCE,
    }
    const INVALID_PRISONER_SESSION = {
      dobEncoded: VALID_ENCODED_DOB,
      relationship: VALID_RELATIONSHIP,
      benefit: VALID_BENEFIT,
      benefitOwner: VALID_BENEFIT_OWNER,
      referenceId: INVALID_REFERENCE_ID,
      decryptedRef: INVALID_REFERENCE,
    }
    const VALID_PRISONER_SESSION_URL = '/apply/first-time/new-eligibility/about-you'

    it('should return true if passed a valid about-the-prisoner value', () => {
      const result = SessionHandler.validateSession(VALID_PRISONER_SESSION, VALID_PRISONER_SESSION_URL)
      expect(result).toBe(true)
    })

    it('should return false if passed a null about-the-prisoner value', () => {
      const result = SessionHandler.validateSession(NULL_PRISONER_SESSION, VALID_PRISONER_SESSION_URL)
      expect(result).toBe(false)
    })

    it('should throw Error if passed an invalid about-the-prisoner value', () => {
      expect(() => {
        SessionHandler.validateSession(INVALID_PRISONER_SESSION, VALID_PRISONER_SESSION_URL)
      }).toThrow(Error)
    })
  })

  describe('about-you Session', () => {
    const VALID_ABOUT_YOU_SESSION = {
      dobEncoded: VALID_ENCODED_DOB,
      relationship: VALID_RELATIONSHIP,
      benefit: VALID_BENEFIT,
      referenceId: VALID_REFERENCE_ID,
      decryptedRef: VALID_REFERENCE,
      claimType: VALID_CLAIM_TYPE,
      advanceOrPast: VALID_ADVANCE_OR_PAST,
    }
    const NULL_ABOUT_YOU_SESSION = {
      dobEncoded: VALID_ENCODED_DOB,
      relationship: VALID_RELATIONSHIP,
      benefit: VALID_BENEFIT,
      referenceId: VALID_REFERENCE_ID,
      decryptedRef: VALID_REFERENCE,
      claimType: NULL_CLAIM_TYPE,
      advanceOrPast: NULL_ADVANCE_OR_PAST,
    }
    const INVALID_ABOUT_YOU_SESSION = {
      dobEncoded: VALID_ENCODED_DOB,
      relationship: VALID_RELATIONSHIP,
      benefit: VALID_BENEFIT,
      referenceId: VALID_REFERENCE_ID,
      decryptedRef: VALID_REFERENCE,
      claimType: INVALID_CLAIM_TYPE,
      advanceOrPast: INVALID_ADVANCE_OR_PAST,
    }
    const VALID_ABOUT_YOU_SESSION_URL = '/apply/eligibility/new-claim/journey-information'

    it('should return true if passed a valid about-you value', () => {
      const result = SessionHandler.validateSession(VALID_ABOUT_YOU_SESSION, VALID_ABOUT_YOU_SESSION_URL)
      expect(result).toBe(true)
    })

    it('should return false if passed a null about-you value', () => {
      const result = SessionHandler.validateSession(NULL_ABOUT_YOU_SESSION, VALID_ABOUT_YOU_SESSION_URL)
      expect(result).toBe(false)
    })

    it('should throw Error if passed an invalid about-you value', () => {
      expect(() => {
        SessionHandler.validateSession(INVALID_ABOUT_YOU_SESSION, VALID_ABOUT_YOU_SESSION_URL)
      }).toThrow(Error)
    })
  })

  describe('journey-information Session', () => {
    const VALID_JOURNEY_SESSION = {
      dobEncoded: VALID_ENCODED_DOB,
      relationship: VALID_RELATIONSHIP,
      benefit: VALID_BENEFIT,
      referenceId: VALID_REFERENCE_ID,
      decryptedRef: VALID_REFERENCE,
      claimType: VALID_CLAIM_TYPE,
      advanceOrPast: VALID_ADVANCE_OR_PAST,
      claimId: VALID_CLAIMID,
    }
    const NULL_JOURNEY_SESSION = {
      dobEncoded: VALID_ENCODED_DOB,
      relationship: VALID_RELATIONSHIP,
      benefit: VALID_BENEFIT,
      referenceId: VALID_REFERENCE_ID,
      decryptedRef: VALID_REFERENCE,
      claimType: VALID_CLAIM_TYPE,
      advanceOrPast: VALID_ADVANCE_OR_PAST,
      claimId: NULL_CLAIMID,
    }
    const INVALID_JOURNEY_SESSION = {
      dobEncoded: VALID_ENCODED_DOB,
      relationship: VALID_RELATIONSHIP,
      benefit: VALID_BENEFIT,
      referenceId: VALID_REFERENCE_ID,
      decryptedRef: VALID_REFERENCE,
      claimType: VALID_CLAIM_TYPE,
      advanceOrPast: VALID_ADVANCE_OR_PAST,
      claimId: INVALID_CLAIMID,
    }
    const VALID_JOURNEY_SESSION_URL = '/apply/eligibility/claim/has-escort'

    it('should return true if passed a valid journey-information value', () => {
      const result = SessionHandler.validateSession(VALID_JOURNEY_SESSION, VALID_JOURNEY_SESSION_URL)
      expect(result).toBe(true)
    })

    it('should return false if passed a null journey-information value', () => {
      const result = SessionHandler.validateSession(NULL_JOURNEY_SESSION, VALID_JOURNEY_SESSION_URL)
      expect(result).toBe(false)
    })

    it('should throw Error if passed an invalid journey-information value', () => {
      expect(() => {
        SessionHandler.validateSession(INVALID_JOURNEY_SESSION, VALID_JOURNEY_SESSION_URL)
      }).toThrow(Error)
    })
  })
})

describe('services/validators/session-handler getErrorPath', () => {
  const FIRST_TIME_ERROR_SESSION_URL = `/apply/${claimTypeEnum.FIRST_TIME}/new-eligibility/date-of-birth?error=expired`
  const REPEAT_ERROR_SESSION_URL = '/start-already-registered?error=expired'

  const FIRST_TIME_PARAMS_URL = '/apply/first-time/new-eligibility/about-the-prisoner'
  const REPEAT_PARAMS_URL = '/apply/repeat-new-eligibility/new-eligibility/about-the-prisoner'
  const CLAIM_TYPE_SESSION_URL = '/apply/eligibility/claim/has-escort'

  const VALID_SESSION = {
    dobEncoded: VALID_ENCODED_DOB,
    relationship: VALID_RELATIONSHIP,
    benefit: VALID_BENEFIT,
    referenceId: VALID_REFERENCE_ID,
    decryptedRef: VALID_REFERENCE,
  }

  const VALID_FIRST_TIME_SESSION = {
    dobEncoded: VALID_ENCODED_DOB,
    relationship: VALID_RELATIONSHIP,
    benefit: VALID_BENEFIT,
    referenceId: VALID_REFERENCE_ID,
    decryptedRef: VALID_REFERENCE,
    claimType: claimTypeEnum.FIRST_TIME,
    advanceOrPast: VALID_ADVANCE_OR_PAST,
    claimId: VALID_CLAIMID,
  }

  const VALID_REPEAT_SESSION = {
    dobEncoded: VALID_ENCODED_DOB,
    relationship: VALID_RELATIONSHIP,
    benefit: VALID_BENEFIT,
    referenceId: VALID_REFERENCE_ID,
    decryptedRef: VALID_REFERENCE,
    claimType: claimTypeEnum.REPEAT_NEW_ELIGIBILITY,
    advanceOrPast: VALID_ADVANCE_OR_PAST,
    claimId: VALID_CLAIMID,
  }

  describe('first-time Session', () => {
    it('should return valid first time error path if passed a valid first-time url param', () => {
      const result = SessionHandler.getErrorPath(VALID_SESSION, FIRST_TIME_PARAMS_URL)
      expect(result).toBe(FIRST_TIME_ERROR_SESSION_URL)
    })

    it('should return valid first time error path if passed a valid first-time session', () => {
      const result = SessionHandler.getErrorPath(VALID_FIRST_TIME_SESSION, CLAIM_TYPE_SESSION_URL)
      expect(result).toBe(FIRST_TIME_ERROR_SESSION_URL)
    })
  })

  describe('repeat Session', () => {
    it('should return valid repeat error path if passed a valid repeat-new-eligibility url param', () => {
      const result = SessionHandler.getErrorPath(VALID_SESSION, REPEAT_PARAMS_URL)
      expect(result).toBe(REPEAT_ERROR_SESSION_URL)
    })

    it('should return valid repeat error path if passed a valid repeat-new-eligibility session', () => {
      const result = SessionHandler.getErrorPath(VALID_REPEAT_SESSION, CLAIM_TYPE_SESSION_URL)
      expect(result).toBe(REPEAT_ERROR_SESSION_URL)
    })
  })
})

describe('services/validators/session-handler clearSession', () => {
  const VALID_SESSION = {
    dobEncoded: VALID_ENCODED_DOB,
    relationship: VALID_RELATIONSHIP,
    benefit: VALID_BENEFIT,
    referenceId: VALID_REFERENCE_ID,
    decryptedRef: VALID_REFERENCE,
    claimType: VALID_CLAIM_TYPE,
    advanceOrPast: VALID_ADVANCE_OR_PAST,
    claimId: VALID_CLAIMID,
  }
  const CLEAR_SESSION_URL = '/start'
  const DONT_CLEAR_SESSION_URL = '/apply/first-time/new-eligibility/about-the-prisoner'

  it('should return null session if passed a valid dobEncoded value', () => {
    const result = SessionHandler.clearSession(VALID_SESSION, CLEAR_SESSION_URL)
    expect(result).toBeNull()
  })

  it('should return false if passed a null dobEncoded value', () => {
    const result = SessionHandler.clearSession(VALID_SESSION, DONT_CLEAR_SESSION_URL)
    expect(result).toBe(VALID_SESSION)
  })
})
