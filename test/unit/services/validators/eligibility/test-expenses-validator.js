const expect = require('chai').expect
const ExpensesValidator = require('../../../../../app/services/validators/eligibility/expenses-validator')

describe('services/validators/eligibility/benefit-validator', function () {
  const VALID_DATA = {
    'expenses': 'some expense'
  }
  const INVALID_DATA = {
    'expenses': ''
  }

  it('should throw error if data is null', function () {
    expect(function () {
      ExpensesValidator(null)
    }).to.throw(TypeError)
  })

  it('should throw error if data is undefined', function () {
    expect(function () {
      ExpensesValidator(undefined)
    }).to.throw(TypeError)
  })

  it('should return false if provided with valid data', function () {
    var errors = ExpensesValidator(VALID_DATA)
    expect(errors).to.equal(false)
  })

  it('should return an error object if provided with invalid data', function () {
    var errors = ExpensesValidator(INVALID_DATA)
    expect(errors).to.have.property('expenses')
  })
})
