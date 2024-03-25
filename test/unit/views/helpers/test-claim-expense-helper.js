const claimExpenseHelper = require('../../../../app/views/helpers/claim-expense-helper')
const ticketOwnerEnum = require('../../../../app/constants/ticket-owner-enum')

describe('views/helpers/claim-expense-helper', function () {
  const FROM = 'PointA'
  const TO = 'hewell'
  const DURATION_OF_TRAVEL = '2'
  const TICKET_TYPE = 'foot-passenger'
  const TRAVEL_TIME = '10am'
  const RETURN_TIME = '4pm'

  const CHILD_PREFIX = ticketOwnerEnum.CHILD.displayValue + ' - '
  const YOU_PREFIX = ticketOwnerEnum.YOU.displayValue + ' - '
  const ESCORT_PREFIX = ticketOwnerEnum.ESCORT.displayValue + ' - '
  const RETURN_POSTFIX = ' - Return'

  it('should return formatted detail string for ClaimExpense', function () {
    expect(claimExpenseHelper({ ExpenseType: 'hire', From: FROM, To: TO, DurationOfTravel: 2 })).toBe(`${FROM} to ${TO} for ${DURATION_OF_TRAVEL} days`)

    expect(claimExpenseHelper({ ExpenseType: 'bus', From: FROM, To: TO })).toBe(`${FROM} to ${TO}`)

    expect(claimExpenseHelper({ ExpenseType: 'train', From: FROM, To: TO })).toBe(`${FROM} to ${TO}`)

    expect(claimExpenseHelper({ ExpenseType: 'refreshment' })).toBe('')

    expect(claimExpenseHelper({ ExpenseType: 'accommodation', DurationOfTravel: DURATION_OF_TRAVEL })).toBe(`Nights stayed: ${DURATION_OF_TRAVEL}`)

    expect(claimExpenseHelper({ ExpenseType: 'ferry', From: FROM, To: TO, TicketType: TICKET_TYPE })).toBe(`${FROM} to ${TO} as a foot passenger`)

    expect(claimExpenseHelper({ ExpenseType: 'car', From: FROM, To: TO, TicketType: TICKET_TYPE })).toBe(`${FROM} to Hewell`)

    expect(claimExpenseHelper({ ExpenseType: 'anything-else', From: FROM, To: TO })).toBe(`${FROM} to ${TO}`)
  })

  it('should prepend child prefix for bus, train, plane, and ferry expenses', function () {
    expect(claimExpenseHelper({ ExpenseType: 'bus', From: FROM, To: TO, TicketOwner: ticketOwnerEnum.CHILD.value })).toBe(`${CHILD_PREFIX}${FROM} to ${TO}`)

    expect(claimExpenseHelper({ ExpenseType: 'train', From: FROM, To: TO, TicketOwner: ticketOwnerEnum.CHILD.value })).toBe(`${CHILD_PREFIX}${FROM} to ${TO}`)

    expect(claimExpenseHelper({ ExpenseType: 'plane', From: FROM, To: TO, TicketOwner: ticketOwnerEnum.CHILD.value })).toBe(`${CHILD_PREFIX}${FROM} to ${TO}`)

    expect(claimExpenseHelper({ ExpenseType: 'ferry', From: FROM, To: TO, TicketOwner: ticketOwnerEnum.CHILD.value, TicketType: TICKET_TYPE })).toBe(`${CHILD_PREFIX}${FROM} to ${TO} as a foot passenger`)
  })

  it('should prepend you prefix for bus, train, plane, and ferry expenses', function () {
    expect(claimExpenseHelper({ ExpenseType: 'bus', From: FROM, To: TO, TicketOwner: ticketOwnerEnum.YOU.value })).toBe(`${YOU_PREFIX}${FROM} to ${TO}`)

    expect(claimExpenseHelper({ ExpenseType: 'train', From: FROM, To: TO, TicketOwner: ticketOwnerEnum.YOU.value })).toBe(`${YOU_PREFIX}${FROM} to ${TO}`)

    expect(claimExpenseHelper({ ExpenseType: 'plane', From: FROM, To: TO, TicketOwner: ticketOwnerEnum.YOU.value })).toBe(`${YOU_PREFIX}${FROM} to ${TO}`)

    expect(claimExpenseHelper({ ExpenseType: 'ferry', From: FROM, To: TO, TicketOwner: ticketOwnerEnum.YOU.value, TicketType: TICKET_TYPE })).toBe(`${YOU_PREFIX}${FROM} to ${TO} as a foot passenger`)
  })

  it('should prepend escort prefix for bus, train, plane, and ferry expenses', function () {
    expect(claimExpenseHelper({ ExpenseType: 'bus', From: FROM, To: TO, TicketOwner: ticketOwnerEnum.ESCORT.value })).toBe(`${ESCORT_PREFIX}${FROM} to ${TO}`)

    expect(claimExpenseHelper({ ExpenseType: 'train', From: FROM, To: TO, TicketOwner: ticketOwnerEnum.ESCORT.value })).toBe(`${ESCORT_PREFIX}${FROM} to ${TO}`)

    expect(claimExpenseHelper({ ExpenseType: 'plane', From: FROM, To: TO, TicketOwner: ticketOwnerEnum.ESCORT.value })).toBe(`${ESCORT_PREFIX}${FROM} to ${TO}`)

    expect(claimExpenseHelper({ ExpenseType: 'ferry', From: FROM, To: TO, TicketOwner: ticketOwnerEnum.ESCORT.value, TicketType: TICKET_TYPE })).toBe(`${ESCORT_PREFIX}${FROM} to ${TO} as a foot passenger`)
  })

  it('should append return postfix for bus, train, plane, and ferry expenses', function () {
    expect(claimExpenseHelper({ ExpenseType: 'bus', From: FROM, To: TO, IsReturn: true })).toBe(`${FROM} to ${TO}${RETURN_POSTFIX}`)

    expect(claimExpenseHelper({ ExpenseType: 'train', From: FROM, To: TO, IsReturn: true })).toBe(`${FROM} to ${TO}${RETURN_POSTFIX}`)

    expect(claimExpenseHelper({ ExpenseType: 'plane', From: FROM, To: TO, IsReturn: true })).toBe(`${FROM} to ${TO}${RETURN_POSTFIX}`)

    expect(claimExpenseHelper({ ExpenseType: 'ferry', From: FROM, To: TO, IsReturn: true, TicketType: TICKET_TYPE })).toBe(`${FROM} to ${TO} as a foot passenger${RETURN_POSTFIX}`)
  })

  it('should append times onto advance train journeys which have them', function () {
    expect(claimExpenseHelper({ ExpenseType: 'train', From: FROM, To: TO, IsReturn: true, TravelTime: TRAVEL_TIME, ReturnTime: RETURN_TIME })).toBe(`${FROM} to ${TO} (${TRAVEL_TIME})${RETURN_POSTFIX} (${RETURN_TIME})`)
  })
})
