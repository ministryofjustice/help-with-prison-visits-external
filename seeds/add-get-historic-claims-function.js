const config = require('../config')

/**
 * Adds a table function to the IntSchema that retrieves all claims with the given reference number and dob and grants
 * the external web user permissions to call it.
 *
 * We need to retrieve the claims from the Internal database as each successfuly submitted application is copied to the
 * internal database and then removed from the external database.
 */
exports.seed = function (knex, Promise) {
  return knex.schema
    .raw('DROP FUNCTION IF EXISTS getHistoricClaims')
    .then(function () {
      return knex.schema
        .raw(
          `
            CREATE FUNCTION getHistoricClaims(@reference varchar(7), @dob datetime)
            RETURNS TABLE
            AS
            RETURN
            (
              SELECT
                Claim.ClaimId,
                Claim.DateOfJourney,
                Claim.Status,
                Claim.EligibilityId,
                Visitor.DateOfBirth,
                Prisoner.FirstName,
                Prisoner.LastName,
                Prisoner.NameOfPrison,
                Prisoner.PrisonNumber,
                Visitor.DWPCheck AS BenefitStatus,
                Claim.VisitConfirmationCheck,
                Claim.IsAdvanceClaim,
                Prisoner.NomisCheck,
                Claim.DateSubmitted
              FROM Claim AS Claim
                JOIN Visitor AS Visitor ON Visitor.EligibilityId = Claim.EligibilityId
                JOIN Prisoner AS Prisoner ON Prisoner.EligibilityId = Claim.EligibilityId
              WHERE
                Claim.Reference = @reference AND
                Visitor.DateOfBirth = @dob
            )
          `
        )
        .raw('GRANT SELECT ON getHistoricClaims TO ??;', [config.EXT_WEB_USERNAME])
    })
    .catch(function (error) {
      console.log(error)
      throw error
    })
}
