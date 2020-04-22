const Expenses = require('../../../../../app/services/domain/expenses/expenses')
const ValidationError = require('../../../../../app/services/errors/validation-error')
const expenseTypeEnum = require('../../../../../app/constants/expense-type-enum')
const expect = require('chai').expect

describe('services/domain/expenses/expenses', function () {
  const VALID_EXPENSES_ARRAY = [expenseTypeEnum.BUS.value, expenseTypeEnum.FERRY.value]
  const INVALID_EXPENSES = [expenseTypeEnum.FERRY.value, 'some invalid value']

  it('should construct a domain object given valid input', function () {
    var expense = new Expenses(
      VALID_EXPENSES_ARRAY
    )
    expect(expense.expense).to.equal(VALID_EXPENSES_ARRAY)
  })

  it('should throw an error if passed invalid data', function () {
    expect(function () {
      new Expenses(
        INVALID_EXPENSES
      ).isValid()
    }).to.throw(ValidationError)
  })
})
