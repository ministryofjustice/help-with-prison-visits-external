const validator = require('./common-validator')
const VALIDATION_ERROR = new Error('An error has occured')

/**
 * A validator for validating URL path paramaeters.
 * Takes the param property of a HTTP request as input.
 */
class UrlPathValidator {

  static validate (path) {
    this.validatePath(path['dob'], 'isValidDateOfBirth')
    this.validatePath(path['relationship'], 'isValidPrisonerRelationship')
    this.validatePath(path['assistance'], 'isValidJourneyAssistance')
    this.validatePath(path['requireBenefitUpload'], 'isValidBenefitResponse')
    this.validatePath(path['reference'], 'isValidReference')
    this.validatePath(path['claim'], 'isNumeric')
  }

  static validatePath (param, validateFunction) {
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
