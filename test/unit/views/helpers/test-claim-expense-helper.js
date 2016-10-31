const expect = require('chai').expect

const claimExpenseHelper = require('../../../../app/views/helpers/claim-expense-helper')

describe('views/helpers/claim-expense-helper', function () {
  describe('DisplayName', function () {
    it('should return display name for ClaimExpense', function (done) {
      expect(claimExpenseHelper.DisplayName({ExpenseType: 'car'})).to.equal('Car Journey')

      done()
    })
  })

  describe('FormattedDetail', function () {
    it('should return formatted detail string for ClaimExpense', function (done) {
      var claimExpense = {
        ExpenseType: 'car',
        From: 'PointA',
        To: 'PointB'
      }

      expect(claimExpenseHelper.FormattedDetail(claimExpense)).to.equal('PointA to PointB')

      done()
    })
  })
})
