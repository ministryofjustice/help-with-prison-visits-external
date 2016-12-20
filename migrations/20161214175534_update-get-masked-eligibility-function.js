const config = require('../config')

/**
 * Adds a table function to the IntSchema that retrieves eligibility data for a reference number and
 * dob or eligibilityId and grants the external web user permissions to call it.
 *
 * This information should be masked so the external web cannot query personal information
 */
exports.up = function (knex, Promise) {
  return knex.schema
    .raw('DROP FUNCTION IntSchema.getMaskedEligibility')
    .raw(
      `
        CREATE FUNCTION IntSchema.getMaskedEligibility(@reference varchar(7), @dob datetime, @eligibiltyId int)
        RETURNS TABLE
        AS
        RETURN
        (
          SELECT TOP(1)
            Eligibility.EligibilityId,
            Visitor.FirstName,
            STUFF(Visitor.LastName, 2, 100, REPLICATE('*', LEN(Visitor.LastName) - 1)) AS LastName,
            Visitor.HouseNumberAndStreet,
            Visitor.Town,
            Visitor.PostCode,
            Visitor.Benefit,
            Visitor.Relationship,
            Visitor.EmailAddress,
            CASE
              WHEN ISNULL(Visitor.PhoneNumber, '') = '' THEN ''
              ELSE '******' + RIGHT(Visitor.PhoneNumber, 4)
            END AS PhoneNumber,
            Prisoner.FirstName AS PrisonerFirstName,
            STUFF(Prisoner.LastName, 2, 100, REPLICATE('*', LEN(Prisoner.LastName) - 1)) AS PrisonerLastName,
            Prisoner.NameOfPrison,
            Prisoner.PrisonNumber
          FROM IntSchema.Eligibility AS Eligibility
            JOIN IntSchema.Visitor AS Visitor ON Visitor.EligibilityId = Eligibility.EligibilityId
            JOIN IntSchema.Prisoner AS Prisoner ON Prisoner.EligibilityId = Eligibility.EligibilityId
          WHERE
            Eligibility.Reference = @reference AND
            (Visitor.DateOfBirth = @dob OR Eligibility.EligibilityId = @eligibiltyId)
          ORDER BY Eligibility.DateSubmitted DESC
        )
      `
    )
    .raw('GRANT SELECT ON IntSchema.getMaskedEligibility TO ??;', [config.EXT_WEB_USERNAME])
    .catch(function (error) {
      console.log(error)
      throw error
    })
}

exports.down = function (knex, Promise) {
  return knex.schema
    .raw('DROP FUNCTION IntSchema.getMaskedEligibility')
    .raw(
      `
        CREATE FUNCTION IntSchema.getMaskedEligibility(@reference varchar(7), @dob datetime, @eligibiltyId int)
        RETURNS TABLE
        AS
        RETURN
        (
          SELECT TOP(1)
            Eligibility.EligibilityId,
            Visitor.FirstName,
            STUFF(Visitor.LastName, 2, 100, REPLICATE('*', LEN(Visitor.LastName) - 1)) AS LastName,
            Visitor.HouseNumberAndStreet,
            Visitor.Town,
            Visitor.PostCode,
            Visitor.Benefit,
            Visitor.Relationship,
            Visitor.EmailAddress,
            CASE
              WHEN ISNULL(Visitor.PhoneNumber, '') = '' THEN ''
              ELSE '******' + RIGHT(Visitor.PhoneNumber, 4)
            END AS PhoneNumber,
            Prisoner.FirstName AS PrisonerFirstName,
            STUFF(Prisoner.LastName, 2, 100, REPLICATE('*', LEN(Prisoner.LastName) - 1)) AS PrisonerLastName,
            Prisoner.NameOfPrison,
            Prisoner.PrisonNumber
          FROM IntSchema.Eligibility AS Eligibility
            JOIN IntSchema.Visitor AS Visitor ON Visitor.EligibilityId = Eligibility.EligibilityId
            JOIN IntSchema.Prisoner AS Prisoner ON Prisoner.EligibilityId = Eligibility.EligibilityId
          WHERE
            Eligibility.Reference = @reference AND
            (Visitor.DateOfBirth = @dob OR Eligibility.EligibilityId = @eligibiltyId)
          ORDER BY Eligibility.DateSubmitted DESC
        )
      `
    )
    .raw('GRANT SELECT ON IntSchema.getMaskedEligibility TO ??;', [config.EXT_WEB_USERNAME])
    .catch(function (error) {
      console.log(error)
      throw error
    })
}
