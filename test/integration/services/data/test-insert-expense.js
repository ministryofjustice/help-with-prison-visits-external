const expect = require('chai').expect
const config = require('../../../../knexfile').migrations
const knex = require('knex')(config)
const BusExpense = require('../../../../app/services/domain/expenses/bus-expense')
const insertExpense = require('../../../../app/services/data/insert-expense')

describe('services/data/insert-expense', function () {
  const CLAIM_ID = '1'
  const EXPENSE_TYPE = 'bus'
  const COST = '10'
  const TRAVEL_TIME = null
  const FROM = 'London'
  const TO = 'Edinburgh'
  const IS_RETURN = 'yes'
  const DURATION_OF_TRAVEL = null
  const TICKET_TYPE = null

  it('should insert a new expense', function (done) {
    var expense = new BusExpense(
      CLAIM_ID,
      COST,
      FROM,
      TO,
      IS_RETURN
    )

    insertExpense(expense)
      .then(function () {
        knex.select()
          .from('ExtSchema.ClaimExpense')
          .where('ClaimId', CLAIM_ID)
          .then(function (results) {
            expect(results.length).to.equal(1)
            expect(results[0].ClaimId.toString()).to.equal(CLAIM_ID)
            expect(results[0].ExpenseType.toString()).to.equal(EXPENSE_TYPE)
            expect(results[0].Cost.toString()).to.equal(COST)
            expect(results[0].TravelTime).to.equal(TRAVEL_TIME)
            expect(results[0].From.toString()).to.equal(FROM)
            expect(results[0].To.toString()).to.equal(TO)
            expect(results[0].IsReturn).to.equal(IS_RETURN === 'yes')
            expect(results[0].DurationOfTravel).to.equal(DURATION_OF_TRAVEL)
            expect(results[0].TicketType).to.equal(TICKET_TYPE)
            done()
          })
      })
      .catch(function (error) {
        throw error
      })
  })

  it('should throw an error if passed a non-expense object.', function (done) {
    expect(function () {
      insertExpense({})
    }).to.throw(Error)
    done()
  })

  after(function (done) {
    knex('ExtSchema.ClaimExpense')
      .where('ClaimId', CLAIM_ID)
      .del()
      .then(function () {
        done()
      })
  })
})
