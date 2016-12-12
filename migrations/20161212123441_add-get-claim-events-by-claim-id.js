const config = require('../config')

/**
 * Adds a table function to the IntSchema that retrieves all claim documents with claimId and grants
 * the external web user permissions to call it.
 *
 */
exports.up = function (knex, Promise) {
  return knex.schema
    .raw(
      `
        CREATE FUNCTION IntSchema.getClaimEvents(@reference varchar(7), @claimId int)
        RETURNS TABLE
        AS
        RETURN
        (
          SELECT
            ClaimEvent.DateAdded,
            ClaimEvent.Caseworker,
            ClaimEvent.Event,
            ClaimEvent.AdditionalData,
            ClaimEvent.Note
          FROM IntSchema.ClaimEvent AS ClaimEvent
          WHERE
            ClaimEvent.Reference = @reference AND
            ClaimEvent.ClaimId = @claimId AND
            ClaimEvent.isInternal = 'false'
        )
      `
    )
    .raw('GRANT SELECT ON IntSchema.getClaimEvents TO ??;', [config.EXT_WEB_USERNAME])
    .catch(function (error) {
      console.log(error)
      throw error
    })
}

exports.down = function (knex, Promise) {
  return knex.schema
    .raw('DROP FUNCTION IntSchema.getClaimEvents')
    .catch(function (error) {
      console.log(error)
      throw error
    })
}

