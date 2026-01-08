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
const log = require('../log')

const VALID_ROLL_NUMBER_REGEX = '^[-0-9.A-Za-z ]+$'

exports.isNullOrUndefined = value => {
  return !value
}

exports.isAlpha = value => {
  return validator.isAlpha(value)
}

exports.isNumeric = value => {
  return validator.isNumeric(value)
}

exports.isLength = (value, length) => {
  return validator.isLength(value, { min: length, max: length })
}

exports.isLessThanLength = (value, length) => {
  return validator.isLength(value, { max: length })
}

exports.isValidDate = date => {
  if (this.isNullOrUndefined(date)) {
    return false
  }
  return date instanceof moment && date.isValid() && dateFormatter.now().diff(date, 'years') < NUM_YEARS_LIMIT
}

exports.isDateInThePast = date => {
  return this.isValidDate(date) && date < dateFormatter.now()
}

exports.isDateInTheFuture = date => {
  return this.isValidDate(date) && date > dateFormatter.now()
}

exports.isDateWithinDays = (date, days) => {
  return Math.abs(dateFormatter.now().startOf('day').diff(date, 'days')) <= days
}

exports.isNotDateWithinDays = (date, days) => {
  return Math.abs(dateFormatter.now().startOf('day').diff(date, 'days')) >= days
}

exports.isOlderThanInYears = (dob, years) => {
  const age = dateFormatter.now().diff(dob, 'years')
  return age >= years
}

exports.isRange = (value, min, max) => {
  return validator.isLength(value, { min, max })
}

exports.isNationalInsuranceNumber = value => {
  return validator.matches(value, '^[A-z]{2}[0-9]{6}[A-z]{1}$')
}

exports.isPostcode = value => {
  return validator.matches(value, '^[A-Z]{1,2}[0-9]{1,2}[A-Z]?[0-9]{1}[A-Z]{2}$')
}

exports.isEmail = value => {
  return validator.isEmail(value)
}

exports.isCurrency = value => {
  return validator.isCurrency(value)
}

exports.isGreaterThanZero = value => {
  return value > 0
}

exports.isInteger = value => {
  return validator.isInt(value)
}

exports.isMaxIntOrLess = value => {
  return value <= SQL_MAX_INT
}

exports.isMaxCostOrLess = value => {
  return value <= parseFloat(config.MAX_COST)
}

exports.isValidDateOfBirth = dob => {
  if (this.isNullOrUndefined(dob)) {
    return false
  }
  if (!(dob instanceof moment)) {
    dob = dateFormatter.buildFromDateString(dob)
  }
  return this.isValidDate(dob) && this.isDateInThePast(dob)
}

exports.isValidPrisonerRelationship = value => {
  let result = false
  Object.keys(prisonerRelationshipsEnum).forEach(key => {
    if (key !== 'getByValue' && prisonerRelationshipsEnum[key].urlValue === value) {
      result = true
    }
  })
  return result
}

exports.isValidBenefit = benefit => {
  let result = false
  Object.keys(benefitsEnum).forEach(key => {
    if (key !== 'getByValue' && benefitsEnum[key].urlValue === benefit) {
      result = true
    }
  })
  return result
}

exports.isValidReference = reference => {
  if (this.isNullOrUndefined(reference)) {
    return false
  }
  return (
    reference.match(referenceNumber.IS_VALID_REGEX) !== null && this.isLength(reference, referenceNumber.VALID_LENGTH)
  )
}

exports.isValidRollNumber = rollNumber => {
  if (this.isNullOrUndefined(rollNumber)) {
    return false
  }
  return rollNumber.match(VALID_ROLL_NUMBER_REGEX) !== null
}

exports.isValidReferenceId = referenceId => {
  if (this.isNullOrUndefined(referenceId)) {
    return false
  }
  return referenceId.match(referenceNumber.IS_VALID_REFERENCE_ID_REGEX) !== null
}

exports.isValidChildRelationship = relationship => {
  let result = false
  Object.keys(childRelationshipEnum).forEach(key => {
    if (childRelationshipEnum[key] === relationship) {
      result = true
    }
  })
  return result
}

exports.isValidBooleanSelect = value => {
  let result = false
  Object.keys(booleanSelectEnum).forEach(key => {
    if (booleanSelectEnum[key] === value) {
      result = true
    }
  })
  return result
}

exports.isValidClaimType = claimType => {
  let result = false
  Object.keys(claimTypeEnum).forEach(key => {
    if (claimTypeEnum[key] === claimType) {
      result = true
    }
  })
  return result
}

const isValidExpense = expense => {
  if (expense === null || expense === undefined) {
    return false
  }
  let result = false
  Object.keys(expenseTypeEnum).forEach(key => {
    log.info(`EXPENSE1: ${key}, ${JSON.stringify(expense)}`)

    if (typeof expense === 'object') {
      const expenses = Object.values(expense)

      if (expenses.includes(expenseTypeEnum[key].value)) {
        result = true
      }
    } else if (expenseTypeEnum[key].value === expense) {
      result = true
    }
  })
  return result
}

exports.isValidExpense = isValidExpense

exports.isValidExpenseArray = expenseArray => {
  let result = true

  log.info(expenseArray)

  if (!(expenseArray instanceof Array)) {
    return isValidExpense(expenseArray)
  }

  expenseArray.forEach(expense => {
    log.info(`EXPENSE2: ${expense}`)
    if (!isValidExpense(expense)) {
      result = false
    }
  })
  return result
}

exports.isValidAdvanceOrPast = value => {
  let result = false
  Object.keys(advancePastEnum).forEach(key => {
    if (advancePastEnum[key] === value) {
      result = true
    }
  })
  return result
}

exports.isVisitDateBeforeReleaseDate = (visitDate, releaseDate) => {
  const visitDateMoment = moment(visitDate)
  const releaseDateMoment = moment(releaseDate)
  return visitDateMoment.isBefore(releaseDateMoment)
}
