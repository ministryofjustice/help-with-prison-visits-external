/* eslint-disable no-new */
const NewClaim = require('../../../../app/services/domain/new-claim')
const ValidationError = require('../../../../app/services/errors/validation-error')
const dateFormatter = require('../../../../app/services/date-formatter')
const booleanSelectEnum = require('../../../../app/constants/boolean-select-enum')
const expect = require('chai').expect

var claim

describe('services/domain/new-claim', function () {
  const VALID_REFERENCE = 'APVS123'
  const VALID_DAY = dateFormatter.now().date()
  const VALID_MONTH = dateFormatter.now().month() + 1 // Needed for zero indexed month
  const VALID_YEAR = dateFormatter.now().year()
  const VALID_CHILD_VISITOR = booleanSelectEnum.YES
  const IS_PAST_CLAIM = false
  const IS_ADVANCE_CLAIM = true

  var expectedDateOfJourney = dateFormatter.build(VALID_DAY, VALID_MONTH, VALID_YEAR)

  it('should construct a domain object given valid input', function () {
    claim = new NewClaim(
      VALID_REFERENCE,
      VALID_DAY,
      VALID_MONTH,
      VALID_YEAR,
      IS_PAST_CLAIM
    )
    expect(claim.reference).to.equal(VALID_REFERENCE)
    expect(claim.dateOfJourney).to.be.within(
      expectedDateOfJourney.subtract(1, 'seconds').toDate(),
      expectedDateOfJourney.add(1, 'seconds').toDate()
    )
    expect(claim.isAdvanceClaim).to.equal(IS_PAST_CLAIM)
  })

  it('should throw ValidationError if given invalid input', function () {
    expect(function () {
      new NewClaim('', '', '', '', false, IS_PAST_CLAIM)
    }).to.throw(ValidationError)
  })

  it('should not throw a ValidationError if is repeat duplicate claim', function () {
    expect(function () {
      claim = new NewClaim(VALID_REFERENCE, VALID_DAY, VALID_MONTH, VALID_YEAR, '', true, IS_PAST_CLAIM)
    }).to.not.throw(ValidationError)
  })

  it('should throw a ValidationError if given a date in the future for past claims', function () {
    var futureDate = dateFormatter.now().add(1, 'days')
    expect(function () {
      new NewClaim(
        VALID_REFERENCE,
        futureDate.date(),
        futureDate.month() + 1,
        futureDate.year(),
        IS_PAST_CLAIM
      )
    }).to.throw(ValidationError)
  })

  it('should throw a ValidationError if given a date more than 28 days away for a past claim', function () {
    var dateFurtherThan28Days = dateFormatter.now().subtract(30, 'days') // 30 rather than 29 as locally fails in BST, server runs GMT
    expect(function () {
      new NewClaim(
        VALID_REFERENCE,
        dateFurtherThan28Days.date(),
        dateFurtherThan28Days.month() + 1,
        dateFurtherThan28Days.year(),
        IS_PAST_CLAIM
      )
    }).to.throw(ValidationError)
  })

  it('should throw a ValidationError if given a date more than 28 days away for an advance claim', function () {
    var dateFurtherThan28Days = dateFormatter.now().add(29, 'days') // 30 rather than 29 as locally fails in BST, server runs GMT
    expect(function () {
      new NewClaim(
        VALID_REFERENCE,
        dateFurtherThan28Days.date(),
        dateFurtherThan28Days.month() + 1,
        dateFurtherThan28Days.year(),
        IS_ADVANCE_CLAIM
      )
    }).to.throw(ValidationError)
  })

  it('should throw a ValidationError if given a date in the future for an advance claims', function () {
    var pastDate = dateFormatter.now().add(-1)
    expect(function () {
      new NewClaim(
        VALID_REFERENCE,
        pastDate.date(),
        pastDate.month() + 1,
        pastDate.year(),
        VALID_CHILD_VISITOR,
        false,
        IS_ADVANCE_CLAIM
      )
    }).to.throw(ValidationError)
  })

  it('should throw a ValidationError if given a date less than 5 days away for an advance claims', function () {
    var futureDate = dateFormatter.now().add(4, 'days')
    expect(function () {
      new NewClaim(
        VALID_REFERENCE,
        futureDate.date(),
        futureDate.month() + 1,
        futureDate.year(),
        VALID_CHILD_VISITOR,
        false,
        IS_ADVANCE_CLAIM
      )
    }).to.throw(ValidationError)
  })
})
