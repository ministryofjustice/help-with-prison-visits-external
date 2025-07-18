const FIELD_NAMES = require('./validation-field-names')

class ErrorHandler {
  constructor() {
    this.errors = {}
  }

  add(fieldName, message, options) {
    if (!Object.prototype.hasOwnProperty.call(this.errors, fieldName)) {
      this.errors[fieldName] = []
    }
    this.errors[fieldName].push(message(FIELD_NAMES[fieldName], options))
  }

  get() {
    const { errors } = this
    // eslint-disable-next-line no-restricted-syntax
    for (const field in errors) {
      if (errors[field].length > 0) {
        return errors
      }
    }

    return false
  }
}

module.exports = () => {
  return new ErrorHandler()
}
