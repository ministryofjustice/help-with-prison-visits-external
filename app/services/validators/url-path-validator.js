const validator = require('./common-validator')
const VALIDATION_ERROR = new Error('An error has occured')
const decrypt = require('../../services/helpers/decrypt')

/**
 * A validator for validating URL path paramaeters.
 * Takes the params property of a HTTP request as input.
 */
class UrlPathValidator {

  static validate (path) {
    if (path['referenceId']) {
      var referenceId = decrypt(path['referenceId'])

      this.validateParam(referenceId.reference, 'isValidReference')
      this.validateParam(referenceId.id, 'isValidReferenceId')
    }

    if (path['reference']) {
      var reference = decrypt(path['reference'])

      this.validateParam(reference, 'isValidReference')
    }

    this.validateParam(path['claimType'], 'isValidClaimType')
    this.validateParam(path['dob'], 'isValidDateOfBirth')
    this.validateParam(path['relationship'], 'isValidPrisonerRelationship')
    this.validateParam(path['benefit'], 'isValidBenefit')
    this.validateParam(path['claimId'], 'isNumeric')
    this.validateParam(path['claimDocumentId'], 'isNumeric')
    this.validateParam(path['advanceOrPast'], 'isValidAdvanceOrPast')
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
