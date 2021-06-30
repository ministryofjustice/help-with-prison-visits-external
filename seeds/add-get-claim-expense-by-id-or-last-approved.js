const config = require('../config')

/**
 * Adds a table function to the IntSchema that retrieves the last approved Claim Expense data for the given reference
 * number and eligibilityId or the Claim Expense data associated with a particular claimId and grants the external web
 * user permissions to call it.
 */
exports.seed = function (knex, Promise) {
  return knex.schema
    .raw('DROP FUNCTION IF EXISTS getClaimExpenseByIdOrLastApproved')
    .then(function () {
      return knex.schema
        .raw(
          `
            CREATE FUNCTION getClaimExpenseByIdOrLastApproved(@reference varchar(7), @eligibiltyId int, @claimId int)
            RETURNS TABLE
            AS
            RETURN
            (
              SELECT
                ClaimExpense.ClaimExpenseId,
                ClaimExpense.ExpenseType,
                ClaimExpense.Cost AS RequestedCost,
                ClaimExpense.ApprovedCost AS Cost,
                ClaimExpense.TravelTime,
                ClaimExpense.[From],
                ClaimExpense.[To],
                ClaimExpense.IsReturn,
                ClaimExpense.DurationOfTravel,
                ClaimExpense.TicketType,
                ClaimExpense.TicketOwner,
                ClaimExpense.Status,
                ClaimExpense.FromPostCode,
                ClaimExpense.ToPostCode,
                ClaimExpense.Distance,
                ClaimExpense.ReturnTime
              FROM ClaimExpense AS ClaimExpense
              WHERE
              (
                ClaimExpense.ClaimId = @claimId AND
                ClaimExpense.Reference = @reference
                OR
                  (
                    @claimId IS NULL AND
                    ClaimExpense.ClaimId IN
                    (
                      SELECT TOP(1) Claim.ClaimId
                      FROM Claim AS Claim
                      WHERE
                        Claim.Reference = @reference AND
                        Claim.EligibilityId = @eligibiltyId AND
                        Claim.Status = 'APPROVED'
                      ORDER BY Claim.DateSubmitted DESC
                    )
                  )
              )
              AND ClaimExpense.IsEnabled = 1
              AND
                (
                  ClaimExpense.Status IS NULL OR
                  ClaimExpense.Status != 'REJECTED'
                )
            )
          `
        )
        .raw('GRANT SELECT ON getClaimExpenseByIdOrLastApproved TO ??;', [config.EXT_WEB_USERNAME])
    })
    .catch(function (error) {
      console.log(error)
      throw error
    })
}
