const expect = require('chai').expect

const claimExpenseHelper = require('../../../../app/views/helpers/claim-expense-helper')

describe('views/helpers/claim-expense-helper', function () {
  describe('DisplayName', function () {
    it('should return display name for ClaimExpense', function () {
      expect(claimExpenseHelper.DisplayName({ExpenseType: 'car'})).to.equal('Car Journey')
    })
  })

  describe('FormattedDetail', function () {
    const FROM = 'PointA'
    const TO = 'PointB'
    const DURATION_OF_TRAVEL = '2'
    const TICKET_TYPE = 'foot-passenger'

    const CHILD_PREFIX = 'Child - '
    const RETURN_POSTFIX = ' - Return'

    it('should return formatted detail string for ClaimExpense', function () {
      expect(claimExpenseHelper.FormattedDetail({ ExpenseType: 'car hire', From: FROM, To: TO, DurationOfTravel: 2 }))
        .to.equal(`${FROM} to ${TO} for ${DURATION_OF_TRAVEL} days`)

      expect(claimExpenseHelper.FormattedDetail({ ExpenseType: 'bus', From: FROM, To: TO }))
        .to.equal(`${FROM} to ${TO}`)

      expect(claimExpenseHelper.FormattedDetail({ ExpenseType: 'train', From: FROM, To: TO }))
        .to.equal(`${FROM} to ${TO}`)

      expect(claimExpenseHelper.FormattedDetail({ ExpenseType: 'refreshment', TravelTime: 'over-five' }))
        .to.equal('Over five hours away but under ten hours')

      expect(claimExpenseHelper.FormattedDetail({ ExpenseType: 'refreshment', TravelTime: 'over-ten' }))
        .to.equal('Over ten hours away')

      expect(claimExpenseHelper.FormattedDetail({ ExpenseType: 'accommodation', DurationOfTravel: DURATION_OF_TRAVEL }))
        .to.equal(`Nights stayed: ${DURATION_OF_TRAVEL}`)

      expect(claimExpenseHelper.FormattedDetail({ ExpenseType: 'ferry', From: FROM, To: TO, TicketType: TICKET_TYPE }))
        .to.equal(`${FROM} to ${TO} as a foot passenger`)

      expect(claimExpenseHelper.FormattedDetail({ ExpenseType: 'anything-else', From: FROM, To: TO }))
        .to.equal(`${FROM} to ${TO}`)
    })

    it('should prepend child prefix for bus, train, plane, and ferry expenses', function () {
      expect(claimExpenseHelper.FormattedDetail({ ExpenseType: 'bus', From: FROM, To: TO, IsChild: true }))
        .to.equal(`${CHILD_PREFIX}${FROM} to ${TO}`)

      expect(claimExpenseHelper.FormattedDetail({ ExpenseType: 'train', From: FROM, To: TO, IsChild: true }))
        .to.equal(`${CHILD_PREFIX}${FROM} to ${TO}`)

      expect(claimExpenseHelper.FormattedDetail({ ExpenseType: 'plane', From: FROM, To: TO, IsChild: true }))
        .to.equal(`${CHILD_PREFIX}${FROM} to ${TO}`)

      expect(claimExpenseHelper.FormattedDetail({ ExpenseType: 'ferry', From: FROM, To: TO, IsChild: true, TicketType: TICKET_TYPE }))
        .to.equal(`${CHILD_PREFIX}${FROM} to ${TO} as a foot passenger`)
    })

    it('should append return postfix for bus, train, plane, and ferry expenses', function () {
      expect(claimExpenseHelper.FormattedDetail({ ExpenseType: 'bus', From: FROM, To: TO, IsReturn: true }))
        .to.equal(`${FROM} to ${TO}${RETURN_POSTFIX}`)

      expect(claimExpenseHelper.FormattedDetail({ ExpenseType: 'train', From: FROM, To: TO, IsReturn: true }))
        .to.equal(`${FROM} to ${TO}${RETURN_POSTFIX}`)

      expect(claimExpenseHelper.FormattedDetail({ ExpenseType: 'plane', From: FROM, To: TO, IsReturn: true }))
        .to.equal(`${FROM} to ${TO}${RETURN_POSTFIX}`)

      expect(claimExpenseHelper.FormattedDetail({ ExpenseType: 'ferry', From: FROM, To: TO, IsReturn: true, TicketType: TICKET_TYPE }))
        .to.equal(`${FROM} to ${TO} as a foot passenger${RETURN_POSTFIX}`)
    })
  })
})
