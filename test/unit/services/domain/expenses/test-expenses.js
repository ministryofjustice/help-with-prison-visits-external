const Expenses = require('../../../../../app/services/domain/expenses/expenses')
const expenseTypeEnum = require('../../../../../app/constants/expense-type-enum')

describe('services/domain/expenses/expenses', function () {
  const VALID_EXPENSES_ARRAY = [expenseTypeEnum.BUS.value, expenseTypeEnum.FERRY.value]
  const INVALID_EXPENSES = [expenseTypeEnum.FERRY.value, 'some invalid value']

  it('should construct a domain object given valid input', function () {
    const expense = new Expenses(
      VALID_EXPENSES_ARRAY
    )
    expect(expense.expense).toBe(VALID_EXPENSES_ARRAY)
  })

  it('should throw an error if passed invalid data', function () {
    expect(function () {
      new Expenses(
        INVALID_EXPENSES
      ).isValid()
    }).toThrow()
  })
})
