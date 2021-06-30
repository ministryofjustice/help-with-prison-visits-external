const config = require('../config')

/**
 * Adds a table function to the IntSchema that retrieves all reference numbers matching supplied data and grants the
 * external web user permissions to call it.
 */
exports.seed = function (knex, Promise) {
  return knex.schema
    .raw('DROP FUNCTION IF EXISTS getReferencesForDuplicateCheck')
    .then(function () {
      return knex.schema
        .raw(
          `
            CREATE FUNCTION getReferencesForDuplicateCheck(@prisonNumber varchar(10), @nationalInsuranceNumber varchar(10))
            RETURNS TABLE
            AS
            RETURN
            (
              SELECT DISTINCT Eligibility.Reference
              FROM Eligibility AS Eligibility
                JOIN Visitor AS Visitor ON Visitor.EligibilityId = Eligibility.EligibilityId
                JOIN Prisoner AS Prisoner ON Prisoner.EligibilityId = Eligibility.EligibilityId
              WHERE
                Prisoner.PrisonNumber = @prisonNumber AND
                Visitor.NationalInsuranceNumber = @nationalInsuranceNumber

            )
          `
        )
        .raw('GRANT SELECT ON getReferencesForDuplicateCheck TO ??;', [config.EXT_WEB_USERNAME])
    })
    .catch(function (error) {
      console.log(error)
      throw error
    })
}
