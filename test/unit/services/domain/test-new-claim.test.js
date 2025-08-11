/* eslint-disable no-new */
const NewClaim = require('../../../../app/services/domain/new-claim')
const ValidationError = require('../../../../app/services/errors/validation-error')
const dateFormatter = require('../../../../app/services/date-formatter')
const booleanSelectEnum = require('../../../../app/constants/boolean-select-enum')

let claim

describe('services/domain/new-claim', () => {
  const VALID_REFERENCE = 'APVS123'
  const VALID_DAY = dateFormatter.now().date()
  const VALID_MONTH = dateFormatter.now().month() + 1 // Needed for zero indexed month
  const VALID_YEAR = dateFormatter.now().year()
  const VALID_CHILD_VISITOR = booleanSelectEnum.YES
  const IS_PAST_CLAIM = false
  const IS_ADVANCE_CLAIM = true
  const RELEASE_DATE_IS_SET = false
  const RELEASE_DATE = null

  const expectedDateOfJourney = dateFormatter.build(VALID_DAY, VALID_MONTH, VALID_YEAR)

  it('should construct a domain object given valid input', () => {
    claim = new NewClaim(
      VALID_REFERENCE,
      VALID_DAY,
      VALID_MONTH,
      VALID_YEAR,
      IS_PAST_CLAIM,
      RELEASE_DATE_IS_SET,
      RELEASE_DATE,
    )
    expect(claim.reference).toBe(VALID_REFERENCE)
    expect(claim.dateOfJourney.toDate().valueOf()).toBeGreaterThanOrEqual(
      expectedDateOfJourney.subtract(1, 'seconds').toDate().valueOf(),
    )
    expect(claim.dateOfJourney.toDate().valueOf()).toBeLessThanOrEqual(
      expectedDateOfJourney.add(1, 'seconds').toDate().valueOf(),
    )
    expect(claim.isAdvanceClaim).toBe(IS_PAST_CLAIM)
  })

  it('should throw ValidationError if given invalid input', () => {
    expect(() => {
      new NewClaim('', '', '', '', false, IS_PAST_CLAIM)
    }).toThrow()
  })

  it('should not throw a ValidationError if is repeat duplicate claim', () => {
    expect(() => {
      claim = new NewClaim(VALID_REFERENCE, VALID_DAY, VALID_MONTH, VALID_YEAR, '', RELEASE_DATE_IS_SET, RELEASE_DATE)
    }).not.toThrow(ValidationError)
  })

  it('should throw a ValidationError if given a date in the future for past claims', () => {
    const futureDate = dateFormatter.now().add(1, 'days')
    expect(() => {
      new NewClaim(
        VALID_REFERENCE,
        futureDate.date(),
        futureDate.month() + 1,
        futureDate.year(),
        IS_PAST_CLAIM,
        RELEASE_DATE_IS_SET,
        RELEASE_DATE,
      )
    }).toThrow()
  })

  it('should throw a ValidationError if given a date more than 60 days away for a past claim', () => {
    const dateFurtherThan60Days = dateFormatter.now().subtract(62, 'days') // 62 rather than 61 as locally fails in BST, server runs GMT
    expect(() => {
      new NewClaim(
        VALID_REFERENCE,
        dateFurtherThan60Days.date(),
        dateFurtherThan60Days.month() + 1,
        dateFurtherThan60Days.year(),
        IS_PAST_CLAIM,
        RELEASE_DATE_IS_SET,
        RELEASE_DATE,
      )
    }).toThrow()
  })

  it('should throw a ValidationError if given a date more than 60 days away for an advance claim', () => {
    const dateFurtherThan60Days = dateFormatter.now().add(62, 'days') // 62 rather than 61 as locally fails in BST, server runs GMT
    expect(() => {
      new NewClaim(
        VALID_REFERENCE,
        dateFurtherThan60Days.date(),
        dateFurtherThan60Days.month() + 1,
        dateFurtherThan60Days.year(),
        IS_ADVANCE_CLAIM,
        RELEASE_DATE_IS_SET,
        RELEASE_DATE,
      )
    }).toThrow()
  })

  it('should throw a ValidationError if given a date in the future for an advance claims', () => {
    const pastDate = dateFormatter.now().add(-1)
    expect(() => {
      new NewClaim(
        VALID_REFERENCE,
        pastDate.date(),
        pastDate.month() + 1,
        pastDate.year(),
        VALID_CHILD_VISITOR,
        false,
        IS_ADVANCE_CLAIM,
      )
    }).toThrow()
  })

  it('should throw a ValidationError if given a date less than 5 days away for an advance claims', () => {
    const futureDate = dateFormatter.now().add(4, 'days')
    expect(() => {
      new NewClaim(
        VALID_REFERENCE,
        futureDate.date(),
        futureDate.month() + 1,
        futureDate.year(),
        VALID_CHILD_VISITOR,
        false,
        IS_ADVANCE_CLAIM,
      )
    }).toThrow()
  })

  it('should throw a ValidationError if given a date after release date', () => {
    const pastDate = dateFormatter.now().subtract(4, 'days')
    expect(() => {
      new NewClaim(
        VALID_REFERENCE,
        pastDate.date(),
        pastDate.month(),
        pastDate.year(),
        IS_ADVANCE_CLAIM,
        true,
        '2019-04-22T00:00:00.000Z',
      )
    }).toThrow()
  })

  it('should not throw a ValidationError if visit date is before release date', () => {
    expect(() => {
      claim = new NewClaim(VALID_REFERENCE, VALID_DAY, VALID_MONTH, VALID_YEAR, '', true, '2030-04-22T00:00:00.000Z')
    }).not.toThrow(ValidationError)
  })
})
