const expect = require('chai').expect
const FieldsetValidator = require('../../../../app/services/validators/fieldset-validator')
const ErrorHandler = require('../../../../app/services/validators/error-handler')
const ERROR_MESSAGES = require('../../../../app/services/validators/validation-error-messages')
const dateFormatter = require('../../../../app/services/date-formatter')

describe('services/validators/fieldset-validator', function () {
  const VALID_DATA_ITEM_1 = 'data 1'
  const VALID_DATA_ITEM_2 = 'data 2'
  const INVALID_DATA_ITEM_1 = ''
  const DATA = [
    VALID_DATA_ITEM_1,
    VALID_DATA_ITEM_2,
    INVALID_DATA_ITEM_1
  ]
  const FIELD_NAME = 'field name'
  const ERROR_HANDLER = ErrorHandler()

  beforeEach(function () {
    this.error = ErrorHandler()
    this.fieldsetValidator = FieldsetValidator(DATA, FIELD_NAME, this.error)
  })

  describe('isRequired', function () {
    it('should return false if data is null', function () {
      FieldsetValidator(null, FIELD_NAME, ERROR_HANDLER)
        .isRequired()
      const errors = ERROR_HANDLER.get()
      expect(errors).to.be.equal(false)
    })

    it('should return false if data is undefined', function () {
      FieldsetValidator(undefined, FIELD_NAME, ERROR_HANDLER)
        .isRequired()
      const errors = ERROR_HANDLER.get()
      expect(errors).to.be.equal(false)
    })

    it('should return false if data is an object', function () {
      FieldsetValidator({}, FIELD_NAME, ERROR_HANDLER)
        .isRequired()
      const errors = ERROR_HANDLER.get()
      expect(errors).to.be.equal(false)
    })

    it('should return an error object if passed an array containing invalid data', function () {
      FieldsetValidator(DATA, FIELD_NAME, ERROR_HANDLER)
        .isRequired()
      const errors = ERROR_HANDLER.get()
      expect(errors).to.have.property(FIELD_NAME)
    })

    it('should return an error object with specific message if passed an array containing invalid data', function () {
      FieldsetValidator(DATA, FIELD_NAME, ERROR_HANDLER)
        .isRequired(ERROR_MESSAGES.getEnterYourDateOfBirth)
      const errors = ERROR_HANDLER.get()
      expect(errors).to.have.property(FIELD_NAME)
      expect(errors[FIELD_NAME]).to.include(ERROR_MESSAGES.getEnterYourDateOfBirth())
    })

    it('should return the fieldsetValidator after being called to allow function chaining.', function () {
      const result = this.fieldsetValidator.isRequired()
      expect(result).to.be.equal(this.fieldsetValidator)
    })
  })

  describe('isValidDateOfBirth', function () {
    it('should return error object if data is null', function () {
      this.fieldsetValidator.isValidDateOfBirth(null)
      const errors = this.error.get()
      expect(errors).to.have.property(FIELD_NAME)
    })

    it('should return error object if data is undefined', function () {
      this.fieldsetValidator.isValidDateOfBirth(undefined)
      const errors = this.error.get()
      expect(errors).to.have.property(FIELD_NAME)
    })

    it('should return error object if data is not a valid date object', function () {
      this.fieldsetValidator.isValidDateOfBirth({})
      const errors = this.error.get()
      expect(errors).to.have.property(FIELD_NAME)
    })

    it('should return false if the date given is valid', function () {
      this.fieldsetValidator.isValidDateOfBirth(dateFormatter.now().subtract(18, 'years'))
      const errors = this.error.get()
      expect(errors).to.equal(false)
    })

    it('should return the fieldsetValidator after being called to allow function chaining.', function () {
      const result = this.fieldsetValidator.isValidDateOfBirth(dateFormatter.now())
      expect(result).to.be.equal(this.fieldsetValidator)
    })
  })

  describe('isPastDate', function () {
    const PAST_DATE = dateFormatter.now().subtract(1, 'day')
    const FUTURE_DATE = dateFormatter.now().add(1, 'day')

    it('should return error object if data is null', function () {
      this.fieldsetValidator.isPastDate(null)
      const errors = this.error.get()
      expect(errors).to.have.property(FIELD_NAME)
    })

    it('should return error object if data is undefined', function () {
      this.fieldsetValidator.isPastDate(undefined)
      const errors = this.error.get()
      expect(errors).to.have.property(FIELD_NAME)
    })

    it('should return error object if data is not a valid date object', function () {
      this.fieldsetValidator.isPastDate({})
      const errors = this.error.get()
      expect(errors).to.have.property(FIELD_NAME)
    })

    it('should return error object if the date given is in the future', function () {
      this.fieldsetValidator.isPastDate(FUTURE_DATE)
      const errors = this.error.get()
      expect(errors).to.have.property(FIELD_NAME)
    })

    it('should return false if the date given is in the past', function () {
      this.fieldsetValidator.isPastDate(PAST_DATE)
      const errors = this.error.get()
      expect(errors).to.equal(false)
    })

    it('should return the fieldsetValidator after being called to allow function chaining.', function () {
      const result = this.fieldsetValidator.isPastDate(dateFormatter.now())
      expect(result).to.be.equal(this.fieldsetValidator)
    })
  })

  describe('isFutureDate', function () {
    const PAST_DATE = dateFormatter.now().subtract(1, 'day')
    const FUTURE_DATE = dateFormatter.now().add(1, 'day')

    it('should return error object if data is null', function () {
      this.fieldsetValidator.isFutureDate(null)
      const errors = this.error.get()
      expect(errors).to.have.property(FIELD_NAME)
    })

    it('should return error object if data is undefined', function () {
      this.fieldsetValidator.isFutureDate(undefined)
      const errors = this.error.get()
      expect(errors).to.have.property(FIELD_NAME)
    })

    it('should return error object if data is not a valid date object', function () {
      this.fieldsetValidator.isFutureDate({})
      const errors = this.error.get()
      expect(errors).to.have.property(FIELD_NAME)
    })

    it('should return error object if the date given is in the past', function () {
      this.fieldsetValidator.isFutureDate(PAST_DATE)
      const errors = this.error.get()
      expect(errors).to.have.property(FIELD_NAME)
    })

    it('should return false if the date given is in the past', function () {
      this.fieldsetValidator.isFutureDate(FUTURE_DATE)
      const errors = this.error.get()
      expect(errors).to.equal(false)
    })

    it('should return the fieldsetValidator after being called to allow function chaining.', function () {
      const result = this.fieldsetValidator.isFutureDate(dateFormatter.now())
      expect(result).to.be.equal(this.fieldsetValidator)
    })
  })

  describe('isDateWithinDays', function () {
    const DAYS = 28
    const DATE_WITHIN_28_DAYS = dateFormatter.now().startOf('day').subtract(1, 'day')
    const DATE_OUTSIDE_28_DAYS = dateFormatter.now().startOf('day').subtract(29, 'day')

    it('should return error object if data is null', function () {
      this.fieldsetValidator.isDateWithinDays(null)
      const errors = this.error.get()
      expect(errors).to.have.property(FIELD_NAME)
    })

    it('should return error object if data is undefined', function () {
      this.fieldsetValidator.isDateWithinDays(undefined)
      const errors = this.error.get()
      expect(errors).to.have.property(FIELD_NAME)
    })

    it('should return error object if data is not a valid date object', function () {
      this.fieldsetValidator.isDateWithinDays({})
      const errors = this.error.get()
      expect(errors).to.have.property(FIELD_NAME)
    })

    it('should return error object if the date given over the given days away', function () {
      this.fieldsetValidator.isDateWithinDays(DATE_OUTSIDE_28_DAYS, DAYS)
      const errors = this.error.get()
      expect(errors).to.have.property(FIELD_NAME)
    })

    it('should return the fieldsetValidator after being called to allow function chaining.', function () {
      const result = this.fieldsetValidator.isDateWithinDays(DATE_WITHIN_28_DAYS, DAYS)
      expect(result).to.be.equal(this.fieldsetValidator)
    })
  })

  describe('isNotDateWithinDays', function () {
    const DAYS = 28
    const DATE_WITHIN_28_DAYS = dateFormatter.now().startOf('day').subtract(1, 'day')
    const DATE_OUTSIDE_28_DAYS = dateFormatter.now().startOf('day').subtract(29, 'day')

    it('should return error object if the date given is not over the given days away', function () {
      this.fieldsetValidator.isNotDateWithinDays(DATE_WITHIN_28_DAYS, DAYS)
      const errors = this.error.get()
      expect(errors).to.have.property(FIELD_NAME)
    })

    it('should return the fieldsetValidator after being called to allow function chaining.', function () {
      const result = this.fieldsetValidator.isNotDateWithinDays(DATE_OUTSIDE_28_DAYS, DAYS)
      expect(result).to.be.equal(this.fieldsetValidator)
    })
  })

  describe('isYoungerThanInYears', function () {
    const YEARS = 18
    const OLDER_THAN_DOB = dateFormatter.now().subtract(YEARS, 'years')

    it('should return error object if data is null', function () {
      this.fieldsetValidator.isYoungerThanInYears(null)
      const errors = this.error.get()
      expect(errors).to.equal(false)
    })

    it('should return error object if data is undefined', function () {
      this.fieldsetValidator.isYoungerThanInYears(undefined)
      const errors = this.error.get()
      expect(errors).to.equal(false)
    })

    it('should return error object if data is not a valid date object', function () {
      this.fieldsetValidator.isYoungerThanInYears({})
      const errors = this.error.get()
      expect(errors).to.equal(false)
    })

    it(`should return error object if the DOB passed has an age greater than ${YEARS} years`, function () {
      this.fieldsetValidator.isYoungerThanInYears(OLDER_THAN_DOB, YEARS)
      const errors = this.error.get()
      expect(errors).to.have.property(FIELD_NAME)
    })

    it('should return the fieldsetValidator after being called to allow function chaining.', function () {
      const result = this.fieldsetValidator.isYoungerThanInYears(OLDER_THAN_DOB, YEARS)
      expect(result).to.be.equal(this.fieldsetValidator)
    })
  })

  describe('isOlderThanInYears', function () {
    const YEARS = 16
    const YOUNGER_THAN_DOB = dateFormatter.now().add(YEARS, 'years')

    it('should return error object if data is null', function () {
      this.fieldsetValidator.isOlderThanInYears(null)
      const errors = this.error.get()
      expect(errors).to.have.property(FIELD_NAME)
    })

    it('should return error object if data is undefined', function () {
      this.fieldsetValidator.isOlderThanInYears(undefined)
      const errors = this.error.get()
      expect(errors).to.have.property(FIELD_NAME)
    })

    it('should return error object if data is not a valid date object', function () {
      this.fieldsetValidator.isOlderThanInYears({})
      const errors = this.error.get()
      expect(errors).to.have.property(FIELD_NAME)
    })

    it(`should return error object if the DOB passed has an age less than ${YEARS} years`, function () {
      this.fieldsetValidator.isOlderThanInYears(YOUNGER_THAN_DOB, YEARS)
      const errors = this.error.get()
      expect(errors).to.have.property(FIELD_NAME)
    })

    it('should return the fieldsetValidator after being called to allow function chaining.', function () {
      const result = this.fieldsetValidator.isOlderThanInYears(YOUNGER_THAN_DOB, YEARS)
      expect(result).to.be.equal(this.fieldsetValidator)
    })
  })
})
