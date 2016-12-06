const config = require('../config')

/**
 * Drop getLastClaimChildren and add a table function to the IntSchema that retrieves the last
 * approved Claim Child data for a reference number and eligibilityId or by claimId and grants
 * the external web user permissions to call it.
 */
exports.up = function (knex, Promise) {
  return knex.schema
    .raw('DROP FUNCTION IntSchema.getLastClaimChildren')
    .then(function () {
      return knex.schema
        .raw(
          `
            CREATE FUNCTION IntSchema.getClaimChildrenByIdOrLastApproved(@reference varchar(7), @eligibiltyId int, @claimId int)
            RETURNS TABLE
            AS
            RETURN
            (
              SELECT
                ClaimChild.Name,
                ClaimChild.DateOfBirth,
                ClaimChild.Relationship
              FROM IntSchema.ClaimChild AS ClaimChild
              WHERE
                ClaimChild.ClaimId = @claimId OR
                ClaimChild.ClaimId IN (
                  SELECT TOP(1) Claim.ClaimId
                  FROM IntSchema.Claim AS Claim
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
        .raw('GRANT SELECT ON IntSchema.getClaimChildrenByIdOrLastApproved TO ??;', [config.EXT_WEB_USERNAME])
    })
    .catch(function (error) {
      console.log(error)
      throw error
    })
}

exports.down = function (knex, Promise) {
  return knex.schema
    .raw('DROP FUNCTION IntSchema.getClaimChildrenByIdOrLastApproved')
    .raw(
      `
        CREATE FUNCTION IntSchema.getLastClaimChildren(@reference varchar(7), @eligibiltyId int)
        RETURNS TABLE
        AS
        RETURN
        (
          SELECT
            ClaimChild.Name,
            ClaimChild.DateOfBirth,
            ClaimChild.Relationship
          FROM IntSchema.ClaimChild AS ClaimChild
          WHERE
            ClaimChild.ClaimId IN (
              SELECT TOP(1) Claim.ClaimId
              FROM IntSchema.Claim AS Claim
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
    .raw('GRANT SELECT ON IntSchema.getLastClaimChildren TO ??;', [config.EXT_WEB_USERNAME])
    .catch(function (error) {
      console.log(error)
      throw error
    })
}
