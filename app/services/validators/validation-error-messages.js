module.exports = {
  getIsRequired: function (displayName) { return `${displayName} is required` },
  getRadioQuestionIsRequired: function (displayName) { return `Select a ${displayName}` },
  getIsAlpha: function (displayName) { return `${displayName} must only contain letters` },
  getIsNumeric: function (displayName) { return `${displayName} must only contain numbers` },
  getIsLengthMessage: function (displayName, options) { return `${displayName} must be ${options.length} characters in length` },
  getIsRangeMessage: function (displayName, options) { return `${displayName} must be between ${options.min} and ${options.max} characters in length` },
  getIsLessThanLengthMessage: function (displayName, options) { return `${displayName} must be less than ${options.length} characters in length` },
  getInvalidDobFormatMessage: function (displayName) { return `${displayName} was invalid` },
  getFutureDobMessage: function (displayName) { return `${displayName} must be in the past` },
  getDropboxIsRequired: function (displayName) { return `${displayName} is required` },
  getIsValidFormat: function (displayName) { return `${displayName} must have valid format` },
  getIsCurrency: function (displayName) { return `${displayName} must be a valid currency` },
  getIsGreaterThan: function (displayName) { return `${displayName} must be greater than zero` }
}
