/**
 * This file defines all generic validation tests used in the application. This file can and should be used by the
 * three higher level validators: FieldValidator, FieldSetValidator, and UrlPathValidator.
 */
const validator = require('validator')
const PRISONER_RELATIONSHIPS = require('../../constants/prisoner-relationships')
const JOURNEY_ASSISTANCE = require('../../constants/journey-assistance')
const BENEFITS = require('../../constants/benefits')
const referenceNumber = require('../../constants/reference-number')
const REFERENCE_CHARACTERS = referenceNumber.REFERENCE_NUMBER_CHARACTERS
const REFERENCE_LENGTH = referenceNumber.REFERENCE_NUMBER_LENGTH
const REFERENCE_REGEX = new RegExp('[' + REFERENCE_CHARACTERS + ']{7}')

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

exports.isDateValid = function (date) {
  return date instanceof Date &&
         date.toString() !== 'Invalid Date'
}

exports.isDateInThePast = function (date) {
  return this.isDateValid(date) &&
         date <= new Date()
}

exports.isRange = function (value, min, max) {
  return validator.isLength(value, {min: min, max: max})
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

exports.isValidDateOfBirth = function (dob) {
  if (this.isNullOrUndefined(dob)) {
    return false
  }
  var date = new Date(dob)
  return this.isDateInThePast(date)
}

exports.isValidPrisonerRelationship = function (relationship) {
  return PRISONER_RELATIONSHIPS.includes(relationship)
}

exports.isValidJourneyAssistance = function (journeyAssistance) {
  return JOURNEY_ASSISTANCE.includes(journeyAssistance)
}

exports.isValidBenefitResponse = function (benefit) {
  return BENEFITS.includes(benefit)
}

exports.isValidReference = function (reference) {
  if (this.isNullOrUndefined(reference)) {
    return false
  }
  return reference.match(REFERENCE_REGEX) !== null &&
         this.isLength(reference, REFERENCE_LENGTH)
}
