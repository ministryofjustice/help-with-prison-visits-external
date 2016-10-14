module.exports = {
  getIsRequired: function (displayName) { return `${displayName} is required` },
  getIsAlpha: function (displayName) { return `${displayName} must only contain letters` },
  getIsNumeric: function (displayName) { return `${displayName} must only contain numbers` },
  getIsLengthMessage: function (displayName) { return `${displayName} must be the correct number of characters` }, // TODO: Params for this.
  getIsValidDayMessage: function (displayName) { return `${displayName} must be within range ...` }, // TODO: Params for this.
  getIsValidMonthMessage: function (displayName) { return `${displayName} must be within range ...` }, // TODO: Params for this.
  getIsValidYearMessage: function (displayName) { return `${displayName} must be within range ...` } // TODO: Params for this.
}
