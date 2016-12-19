const config = require('../config')

/**
 * Adds a table function to the IntSchema that retrieves all claims with the given reference number and dob and grants
 * the external web user permissions to call it.
 *
 * We need to retrieve the claims from the Internal database as each successfuly submitted application is copied to the
 * internal database and then removed from the external database.
 * Updated to return date submitted
 */
exports.up = function (knex, Promise) {
  return knex.schema
    .raw('DROP FUNCTION IntSchema.getHistoricClaims')
    .then(function () {
      return knex.schema
        .raw(
          `
            CREATE FUNCTION IntSchema.getHistoricClaims(@reference varchar(7), @dob datetime)
            RETURNS TABLE
            AS
            RETURN
            (
              SELECT
                Claim.ClaimId,
                Claim.DateOfJourney,
                Claim.Status,
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
              FROM IntSchema.Claim AS Claim
                JOIN IntSchema.Visitor AS Visitor ON Visitor.EligibilityId = Claim.EligibilityId
                JOIN IntSchema.Prisoner AS Prisoner ON Prisoner.EligibilityId = Claim.EligibilityId
              WHERE
                Claim.Reference = @reference AND
                Visitor.DateOfBirth = @dob
            )
          `
        )
        .raw('GRANT SELECT ON IntSchema.getHistoricClaims TO ??;', [config.EXT_WEB_USERNAME])
    })
    .catch(function (error) {
      console.log(error)
      throw error
    })
}

exports.down = function (knex, Promise) {
  return knex.schema
    .raw('DROP FUNCTION IntSchema.getHistoricClaims')
    .raw(
      `
        CREATE FUNCTION IntSchema.getHistoricClaims(@reference varchar(7), @dob datetime)
        RETURNS TABLE
        AS
        RETURN
        (
          SELECT
            Claim.ClaimId,
            Claim.DateOfJourney,
            Claim.Status,
            Visitor.DateOfBirth,
            Prisoner.FirstName,
            Prisoner.LastName,
            Prisoner.NameOfPrison,
            Prisoner.PrisonNumber,
            Visitor.DWPCheck AS BenefitStatus,
            Claim.VisitConfirmationCheck,
            Claim.IsAdvanceClaim,
            Prisoner.NomisCheck
          FROM IntSchema.Claim AS Claim
            JOIN IntSchema.Visitor AS Visitor ON Visitor.EligibilityId = Claim.EligibilityId
            JOIN IntSchema.Prisoner AS Prisoner ON Prisoner.EligibilityId = Claim.EligibilityId
          WHERE
            Claim.Reference = @reference AND
            Visitor.DateOfBirth = @dob
        )
      `
    )
    .raw('GRANT SELECT ON IntSchema.getHistoricClaims TO ??;', [config.EXT_WEB_USERNAME])
    .catch(function (error) {
      console.log(error)
      throw error
    })
}
