module.exports = {
  getIsRequired: function (displayName) { return `${displayName} is required` },
  getRadioQuestionIsRequired: function (displayName) { return `Select a ${displayName}` },
  getJourneyAssistanceIsRequired: function (displayName) { return `Select an option to specify if you need assistance on your journey` },
  getIsAlpha: function (displayName) { return `${displayName} must only contain letters` },
  getIsNumeric: function (displayName) { return `${displayName} must only contain numbers` },
  getIsBetweenMessage: function (displayName, options) { return `${displayName} must be between ${options.min} and ${options.max} characters in length` },
  getInvalidDobFormatMessage: function (displayName) { return `${displayName} was invalid` },
  getFutureDobMessage: function (displayName) { return `${displayName} must be in the past` },
  getDropboxIsRequired: function (displayName) { return `${displayName} have option selected and not left as select` },
  getIsNationalInsuranceNumber: function (displayName) { return `${displayName} must have valid National Insurance Number` },
  getIsPostcode: function (displayName) { return `${displayName} must have valid Postcode` }
}
