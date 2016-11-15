/**
 * Adds a table function to the IntSchema that retrieves all claims with the given reference and grants the external
 * web user permissions to call it. We need to retrieve the claims from the Internal database as each successfuly
 * submitted claim is removed from the external database and copied to the internal database on submission.
 */
exports.up = function (knex, Promise) {
  return knex.schema
    .raw(
      `
        CREATE FUNCTION IntSchema.getClaims(@reference varchar(7)) 
        RETURNS TABLE
        AS
            RETURN
            SELECT ClaimId, DateOfJourney, Status 
            FROM IntSchema.Claim
            WHERE Reference = @reference
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
