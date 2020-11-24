const ValidationError = require('../../errors/validation-error')
const FieldValidator = require('../../validators/field-validator')
const ErrorHandler = require('../../validators/error-handler')
const ERROR_MESSAGES = require('../../validators/validation-error-messages')

class Expenses {
  constructor (expense) {
    this.expense = expense
    this.isValid()
  }

  isValid () {
    const errors = ErrorHandler()

    FieldValidator(this.expense, 'expenses', errors)
      .isRequired(ERROR_MESSAGES.getSelectAnExpense)
      .isValidExpenseArray()

    const validationErrors = errors.get()
    if (validationErrors) {
      throw new ValidationError(validationErrors)
    }
  }
}

module.exports = Expenses
