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
        CREATE FUNCTION IntSchema.getClaimDocumentsHistoricClaim(@reference varchar(7), @claimId int)
        RETURNS TABLE
        AS
        RETURN
        (
          SELECT
            ClaimDocument.DocumentStatus,
            ClaimDocument.DocumentType,
            ClaimDocument.ClaimExpenseId
          FROM IntSchema.ClaimDocument AS ClaimDocument
          WHERE
            ClaimDocument.Reference = @reference AND
            ClaimDocument.ClaimId = @claimId
        )
      `
    )
    .raw('GRANT SELECT ON IntSchema.getClaimDocumentsHistoricClaim TO ??;', [config.EXT_WEB_USERNAME])
    .catch(function (error) {
      console.log(error)
      throw error
    })
}

exports.down = function (knex, Promise) {
  return knex.schema
    .raw('DROP FUNCTION IntSchema.getClaimDocumentsHistoricClaim')
    .catch(function (error) {
      console.log(error)
      throw error
    })
}
