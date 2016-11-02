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
      const from = 'PointA'
      const to = 'PointB'
      const durationOfTravel = 2

      expect(claimExpenseHelper.FormattedDetail({ExpenseType: 'car hire', From: from, To: to, DurationOfTravel: 2})).to.equal(
        `${from} to ${to} for ${durationOfTravel} days`)

      expect(claimExpenseHelper.FormattedDetail({ExpenseType: 'bus', From: from, To: to})).to.equal(
        `${from} to ${to}`)

      expect(claimExpenseHelper.FormattedDetail({ExpenseType: 'train', From: from, To: to, IsReturn: true})).to.equal(
        `${from} to ${to} - Return`)

      expect(claimExpenseHelper.FormattedDetail({ExpenseType: 'light refreshment', TravelTime: 'over-five'})).to.equal(
        'Over five hours away but under ten hours')

      expect(claimExpenseHelper.FormattedDetail({ExpenseType: 'light refreshment', TravelTime: 'over-ten'})).to.equal(
        'Over ten hours away')

      expect(claimExpenseHelper.FormattedDetail({ExpenseType: 'accommodation', DurationOfTravel: durationOfTravel})).to.equal(
        `Nights stayed: ${durationOfTravel}`)

      expect(claimExpenseHelper.FormattedDetail({ExpenseType: 'ferry', From: from, To: to, TicketType: 'foot-passenger'})).to.equal(
        `${from} to ${to} as a foot passenger`)

      expect(claimExpenseHelper.FormattedDetail({ExpenseType: 'anything-else', From: from, To: to})).to.equal(
        `${from} to ${to}`)

      done()
    })
  })
})
