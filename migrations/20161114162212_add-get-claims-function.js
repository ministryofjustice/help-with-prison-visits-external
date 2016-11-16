/**
 * Adds a table function to the IntSchema that retrieves all claims with the given reference and grants the external
 * web user permissions to call it. We need to retrieve the claims from the Internal database as each successfuly
 * submitted claim is removed from the external database and copied to the internal database on submission.
 */
exports.up = function (knex, Promise) {
  return knex.schema
    .raw(
      `
        CREATE FUNCTION IntSchema.getClaims(@reference varchar(7), @dob datetime) 
        RETURNS TABLE
        AS
        RETURN
        (
          SELECT Claim.ClaimId, Claim.DateOfJourney, Claim.Status, Visitor.DateOfBirth
          FROM IntSchema.Claim AS Claim
            JOIN IntSchema.Visitor AS Visitor ON Visitor.Reference = Claim.Reference
          WHERE 
            Claim.Reference = @reference AND
            Visitor.DateOfBirth = @dob
        )
      `
    )
    .raw('GRANT SELECT ON IntSchema.getClaims TO ??;', [process.env.APVS_EXT_WEB_USERNAME])
    .catch(function (error) {
      console.log(error)
      throw error
    })
}

exports.down = function (knex, Promise) {
  return knex.schema
    .raw('DROP FUNCTION IntSchema.getClaims')
    .catch(function (error) {
      console.log(error)
      throw error
    })
}
