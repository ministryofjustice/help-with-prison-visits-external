module.exports = {
  getIsRequired: function (displayName) { return `${displayName} is required` },
  getRadioQuestionIsRequired: function (displayName) { return `Select a ${displayName}` },
  getIsAlpha: function (displayName) { return `${displayName} must only contain letters` },
  getIsNumeric: function (displayName) { return `${displayName} must only contain numbers` },
  getIsLengthMessage: function (displayName, options) { return `${displayName} must be ${options.length} characters in length as shown in the example` },
  getIsRangeMessage: function (displayName, options) { return `${displayName} must be between ${options.min} and ${options.max} characters in length` },
  getIsLessThanLengthMessage: function (displayName, options) { return `${displayName} must be less than ${options.length} characters in length` },
  getInvalidDobFormatMessage: function (displayName) { return `${displayName} was invalid` },
  getFutureDobMessage: function (displayName) { return `${displayName} must be in the past` },
  getDropboxIsRequired: function (displayName) { return `${displayName} must have option selected and not left as select` },
  getIsNationalInsuranceNumber: function (displayName) { return `${displayName} must have valid format` },
  getIsPostcode: function (displayName) { return `${displayName} must have valid format` },
  getIsEmailMessage: function (displayName) { return `${displayName} must have valid format` }
}
