const validator = require('./common-validator')
const VALIDATION_ERROR = new Error('An error has occured')

// TODO: Add a validation check on the claim paramater.

/**
 * A validator for validating URL path paramaeters.
 * Takes the param property of a HTTP request as input.
 */
class UrlPathValidator {

  static validate (path) {
    this.validateDob(path)
    this.validateRelationship(path)
    this.validateAssistance(path)
    this.validateBenefit(path)
    this.validateReference(path)
  }

  static validateDob (path) {
    var dob = path['dob']
    if (dob) {
      if (!validator.isValidDateOfBirth(dob)) {
        throw VALIDATION_ERROR
      }
    }
  }

  static validateRelationship (path) {
    var relationship = path['relationship']
    if (relationship) {
      if (!validator.isValidPrisonerRelationship(relationship)) {
        throw VALIDATION_ERROR
      }
    }
  }

  static validateAssistance (path) {
    var assistance = path['assistance']
    if (assistance) {
      if (!validator.isValidJourneyAssistance(assistance)) {
        throw VALIDATION_ERROR
      }
    }
  }

  static validateBenefit (path) {
    var benefit = path['requireBenefitUpload']
    if (benefit) {
      if (!validator.isValidBenefitResponse(benefit)) {
        throw VALIDATION_ERROR
      }
    }
  }

  static validateReference (path) {
    var reference = path['reference']
    if (reference) {
      if (!validator.isValidReference(reference)) {
        throw VALIDATION_ERROR
      }
    }
  }
}

module.exports = function (data) {
  return UrlPathValidator.validate(data)
}
