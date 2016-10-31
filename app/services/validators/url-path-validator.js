const validator = require('./common-validator')
const VALIDATION_ERROR = new Error('An error has occured')

/**
 * A validator for validating URL path paramaeters.
 * Takes the param property of a HTTP request as input.
 */
class UrlPathValidator {

  static validate (path) {
    this.validateParam(path['dob'], 'isValidDateOfBirth')
    this.validateParam(path['relationship'], 'isValidPrisonerRelationship')
    this.validateParam(path['requireBenefitUpload'], 'isValidBenefitResponse')
    this.validateParam(path['reference'], 'isValidReference')
    this.validateParam(path['claimId'], 'isNumeric')
  }

  static validateParam (param, validateFunction) {
    if (param) {
      if (!validator[validateFunction](param)) {
        throw VALIDATION_ERROR
      }
    }
  }
}

module.exports = function (data) {
  return UrlPathValidator.validate(data)
}
