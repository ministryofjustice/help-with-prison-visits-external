const config = require('../config')

/**
 * Adds a table function to the IntSchema that retrieves the last approved Claim Escort data for the given reference
 * number and eligibilityId or the Claim Escort data associated with a particular claimId and grants the external web
 * user permissions to call it.
 */
exports.seed = function (knex, Promise) {
  return knex.schema
    .raw('DROP FUNCTION IF EXISTS getClaimEscortByIdOrLastApproved')
    .then(function () {
      return knex.schema
        .raw(
          `
            CREATE FUNCTION getClaimEscortByIdOrLastApproved(@reference varchar(7), @eligibiltyId int, @claimId int)
            RETURNS TABLE
            AS
            RETURN
            (
              SELECT
                ClaimEscort.FirstName,
                ClaimEscort.LastName,
                ClaimEscort.DateOfBirth
              FROM ClaimEscort AS ClaimEscort
              WHERE
                (ClaimEscort.ClaimId = @claimId AND
                ClaimEscort.Reference = @reference
                OR
                (@claimId IS NULL AND
                ClaimEscort.ClaimId IN (
                  SELECT TOP(1) Claim.ClaimId
                  FROM Claim AS Claim
                  WHERE
                    Claim.Reference = @reference AND
                    Claim.EligibilityId = @eligibiltyId AND
                    Claim.Status = 'APPROVED'
                  ORDER BY Claim.DateSubmitted DESC
                ))) AND
                ClaimEscort.IsEnabled = 1
            )
          `
        )
        .raw('GRANT SELECT ON getClaimEscortByIdOrLastApproved TO ??;', [config.EXT_WEB_USERNAME])
    })
    .catch(function (error) {
      console.log(error)
      throw error
    })
}
