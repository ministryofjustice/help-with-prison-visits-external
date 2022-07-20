/**
 * This file defines all generic validation tests used in the application. This file can and should be used by the
 * three higher level validators: FieldValidator, FieldSetValidator, and UrlPathValidator.
 */
const validator = require('validator')
const moment = require('moment')
const prisonerRelationshipsEnum = require('../../constants/prisoner-relationships-enum')
const benefitsEnum = require('../../constants/benefits-enum')
const childRelationshipEnum = require('../../constants/child-relationship-enum')
const booleanSelectEnum = require('../../constants/boolean-select-enum')
const claimTypeEnum = require('../../constants/claim-type-enum')
const expenseTypeEnum = require('../../constants/expense-type-enum')
const advancePastEnum = require('../../constants/advance-past-enum')
const referenceNumber = require('../../constants/reference-number-enum')
const dateFormatter = require('../date-formatter')
const NUM_YEARS_LIMIT = 120
const SQL_MAX_INT = 2147483647
const config = require('../../../config')
const VALID_ROLL_NUMBER_REGEX = '^[-0-9.A-Za-z ]+$'

exports.isNullOrUndefined = function (value) {
  return !value
}

exports.isAlpha = function (value) {
  return validator.isAlpha(value)
}

exports.isNumeric = function (value) {
  return validator.isNumeric(value)
}

exports.isLength = function (value, length) {
  return validator.isLength(value, { min: length, max: length })
}

exports.isLessThanLength = function (value, length) {
  return validator.isLength(value, { max: length })
}

exports.isValidDate = function (date) {
  if (this.isNullOrUndefined(date)) {
    return false
  }
  return date instanceof moment &&
    date.isValid() &&
    dateFormatter.now().diff(date, 'years') < NUM_YEARS_LIMIT
}

exports.isDateInThePast = function (date) {
  return this.isValidDate(date) &&
    date < dateFormatter.now()
}

exports.isDateInTheFuture = function (date) {
  return this.isValidDate(date) &&
    date > dateFormatter.now()
}

exports.isDateWithinDays = function (date, days) {
  return Math.abs(dateFormatter.now().startOf('day').diff(date, 'days')) <= days
}

exports.isNotDateWithinDays = function (date, days) {
  return Math.abs(dateFormatter.now().startOf('day').diff(date, 'days')) >= days
}

exports.isOlderThanInYears = function (dob, years) {
  const age = dateFormatter.now().diff(dob, 'years')
  return age >= years
}

exports.isRange = function (value, min, max) {
  return validator.isLength(value, { min, max })
}

exports.isNationalInsuranceNumber = function (value) {
  return validator.matches(value, '^[A-z]{2}[0-9]{6}[A-z]{1}$')
}

exports.isPostcode = function (value) {
  return validator.matches(value, '^[A-Z]{1,2}[0-9]{1,2}[A-Z]?[0-9]{1}[A-Z]{2}$')
}

exports.isEmail = function (value) {
  return validator.isEmail(value)
}

exports.isCurrency = function (value) {
  return validator.isCurrency(value)
}

exports.isGreaterThanZero = function (value) {
  return value > 0
}

exports.isInteger = function (value) {
  return validator.isInt(value)
}

exports.isMaxIntOrLess = function (value) {
  return value <= SQL_MAX_INT
}

exports.isMaxCostOrLess = function (value) {
  return value <= parseFloat(config.MAX_COST)
}

exports.isValidDateOfBirth = function (dob) {
  if (this.isNullOrUndefined(dob)) {
    return false
  }
  if (!(dob instanceof moment)) {
    dob = dateFormatter.buildFromDateString(dob)
  }
  return this.isValidDate(dob) && this.isDateInThePast(dob)
}

exports.isValidPrisonerRelationship = function (value) {
  let result = false
  Object.keys(prisonerRelationshipsEnum).forEach(function (key) {
    if (key !== 'getByValue' && prisonerRelationshipsEnum[key].urlValue === value) {
      result = true
    }
  })
  return result
}

exports.isValidBenefit = function (benefit) {
  let result = false
  Object.keys(benefitsEnum).forEach(function (key) {
    if (key !== 'getByValue' && benefitsEnum[key].urlValue === benefit) {
      result = true
    }
  })
  return result
}

exports.isValidReference = function (reference) {
  if (this.isNullOrUndefined(reference)) {
    return false
  }
  return reference.match(referenceNumber.IS_VALID_REGEX) !== null &&
    this.isLength(reference, referenceNumber.VALID_LENGTH)
}

exports.isValidRollNumber = function (rollNumber) {
  if (this.isNullOrUndefined(rollNumber)) {
    return false
  }
  return rollNumber.match(VALID_ROLL_NUMBER_REGEX) !== null
}

exports.isValidReferenceId = function (referenceId) {
  if (this.isNullOrUndefined(referenceId)) {
    return false
  }
  return referenceId.match(referenceNumber.IS_VALID_REFERENCE_ID_REGEX) !== null
}

exports.isValidChildRelationship = function (relationship) {
  let result = false
  Object.keys(childRelationshipEnum).forEach(function (key) {
    if (childRelationshipEnum[key] === relationship) {
      result = true
    }
  })
  return result
}

exports.isValidBooleanSelect = function (value) {
  let result = false
  Object.keys(booleanSelectEnum).forEach(function (key) {
    if (booleanSelectEnum[key] === value) {
      result = true
    }
  })
  return result
}

exports.isValidClaimType = function (claimType) {
  let result = false
  Object.keys(claimTypeEnum).forEach(function (key) {
    if (claimTypeEnum[key] === claimType) {
      result = true
    }
  })
  return result
}

exports.isValidExpense = function (expense) {
  let result = false
  Object.keys(expenseTypeEnum).forEach(function (key) {
    if (expenseTypeEnum[key].value === expense) {
      result = true
    }
  })
  return result
}

exports.isValidExpenseArray = function (expenseArray) {
  const self = this
  let result = true

  if (!(expenseArray instanceof Array)) {
    return this.isValidExpense(expenseArray)
  }

  expenseArray.forEach(function (expense) {
    if (!self.isValidExpense(expense)) {
      result = false
    }
  })
  return result
}

exports.isValidAdvanceOrPast = function (value) {
  let result = false
  Object.keys(advancePastEnum).forEach(function (key) {
    if (advancePastEnum[key] === value) {
      result = true
    }
  })
  return result
}

exports.isVisitDateBeforeReleaseDate = function (visitDate, releaseDate) {
  const visitDateMoment = moment(visitDate)
  const releaseDateMoment = moment(releaseDate)
  return visitDateMoment.isBefore(releaseDateMoment)
}
