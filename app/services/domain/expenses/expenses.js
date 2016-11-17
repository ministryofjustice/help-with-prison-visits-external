const ValidationError = require('../../errors/validation-error')
const FieldValidator = require('../../validators/field-validator')
const ErrorHandler = require('../../validators/error-handler')

class Expenses {
  constructor (expense) {
    this.expense = expense
    this.isValid()
  }

  isValid () {
    var errors = ErrorHandler()

    FieldValidator(this.expense, 'expenses', errors)
      .isRequired('radio')
      .isValidExpenseArray()

    var validationErrors = errors.get()
    if (validationErrors) {
      throw new ValidationError(validationErrors)
    }
  }
}

module.exports = Expenses
