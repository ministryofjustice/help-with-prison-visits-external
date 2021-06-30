const config = require('../config')

/**
 * Adds a table function to the IntSchema that retrieves the last approved Claim Child data for the given reference
 * number and eligibilityId or by claimId and grants the external web user permissions to call it.
 */
exports.seed = function (knex, Promise) {
  return knex.schema
    .raw('DROP FUNCTION IF EXISTS getClaimChildrenByIdOrLastApproved')
    .then(function () {
      return knex.schema
        .raw(
          `
            CREATE FUNCTION getClaimChildrenByIdOrLastApproved(@reference varchar(7), @eligibiltyId int, @claimId int)
            RETURNS TABLE
            AS
            RETURN
            (
              SELECT
                ClaimChild.FirstName,
                ClaimChild.LastName,
                ClaimChild.DateOfBirth,
                ClaimChild.Relationship
              FROM ClaimChild AS ClaimChild
              WHERE
                ClaimChild.ClaimId = @claimId OR
                ClaimChild.ClaimId IN (
                  SELECT TOP(1) Claim.ClaimId
                  FROM Claim AS Claim
                  WHERE
                    Claim.Reference = @reference AND
                    Claim.EligibilityId = @eligibiltyId AND
                    Claim.Status = 'APPROVED'
                  ORDER BY Claim.DateSubmitted DESC
                ) AND
                ClaimChild.IsEnabled = 1
            )
          `
        )
        .raw('GRANT SELECT ON getClaimChildrenByIdOrLastApproved TO ??;', [config.EXT_WEB_USERNAME])
    })
    .catch(function (error) {
      console.log(error)
      throw error
    })
}
