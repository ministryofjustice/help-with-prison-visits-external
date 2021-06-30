const config = require('../config')

/**
 * Adds a table function to the IntSchema that retrieves all claim events by reference and claimId and grants the
 * external web user permissions to call it.
 */
exports.seed = function (knex, Promise) {
  return knex.schema
    .raw('DROP FUNCTION IF EXISTS getClaimEvents')
    .then(function () {
      return knex.schema
        .raw(
          `
            CREATE FUNCTION getClaimEvents(@reference varchar(7), @claimId int)
            RETURNS TABLE
            AS
            RETURN
            (
              SELECT
                ClaimEvent.DateAdded,
                CASE
                  WHEN ClaimEvent.Caseworker IS NOT NULL THEN 'Caseworker'
                  ELSE NULL
                END AS Caseworker,
                ClaimEvent.Event,
                ClaimEvent.AdditionalData,
                ClaimEvent.Note
              FROM ClaimEvent AS ClaimEvent
              WHERE
                ClaimEvent.Reference = @reference AND
                ClaimEvent.ClaimId = @claimId AND
                ClaimEvent.isInternal = 'false'
            )
          `
        )
        .raw('GRANT SELECT ON getClaimEvents TO ??;', [config.EXT_WEB_USERNAME])
    })
    .catch(function (error) {
      console.log(error)
      throw error
    })
}
