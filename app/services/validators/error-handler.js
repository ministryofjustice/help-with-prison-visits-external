const FIELD_NAMES = require('./validation-field-names')

class ErrorHandler {
  constructor () {
    this.errors = {}
  }

  add (fieldName, message, options) {
    if (!this.errors.hasOwnProperty(fieldName)) {
      this.errors[fieldName] = []
    }
    this.errors[fieldName].push(message(FIELD_NAMES[fieldName], options))
  }

  get () {
    var errors = this.errors
    for (var field in errors) {
      if (errors[ field ].length > 0) {
        return errors
      }
    }
    return false
  }
}

module.exports = function () {
  return new ErrorHandler()
}
