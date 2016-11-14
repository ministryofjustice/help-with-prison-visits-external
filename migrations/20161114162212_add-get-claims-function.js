// TODO: Describe what we are doing in this file. I.e. what the table functions are and why we need them.
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
