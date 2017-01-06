const config = require('../config')

// TODO: REMOVE THIS MIGRATION THE FUNCTION HERE IS NO LONGER USED.

/**
 * Adds a table function to the IntSchema that retrieves the last approved Claim Expense data for a
 * reference number and eligibilityId and grants the external web user permissions to call it.
 */
exports.up = function (knex, Promise) {
  return knex.schema
    .raw(
      `
        CREATE FUNCTION IntSchema.getLastClaimExpenses(@reference varchar(7), @eligibiltyId int)
        RETURNS TABLE
        AS
        RETURN
        (
          SELECT
            ClaimExpense.ExpenseType,
            ClaimExpense.Cost,
            ClaimExpense.TravelTime,
            ClaimExpense.[From],
            ClaimExpense.[To],
            ClaimExpense.IsReturn,
            ClaimExpense.DurationOfTravel,
            ClaimExpense.TicketType,
            ClaimExpense.IsChild
          FROM IntSchema.ClaimExpense AS ClaimExpense
          WHERE
            ClaimExpense.ClaimId IN (
              SELECT TOP(1) Claim.ClaimId
              FROM IntSchema.Claim AS Claim
              WHERE
                Claim.Reference = @reference AND
                Claim.EligibilityId = @eligibiltyId AND
                Claim.Status = 'APPROVED'
              ORDER BY Claim.DateSubmitted DESC
            ) AND
            ClaimExpense.IsEnabled = 1
        )
      `
    )
    .raw('GRANT SELECT ON IntSchema.getLastClaimExpenses TO ??;', [config.EXT_WEB_USERNAME])
    .catch(function (error) {
      console.log(error)
      throw error
    })
}

exports.down = function (knex, Promise) {
  return knex.schema
    .raw('DROP FUNCTION IntSchema.getLastClaimExpenses')
    .catch(function (error) {
      console.log(error)
      throw error
    })
}
