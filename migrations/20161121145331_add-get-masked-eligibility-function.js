const config = require('../config')

/**
 * Adds a table function to the IntSchema that retrieves eligibility data for a reference number and dob and grants
 * the external web user permissions to call it.
 *
 * This information should be masked so the external web cannot query personal information
 */
exports.up = function (knex, Promise) {
  return knex.schema
    .raw(
      `
        CREATE FUNCTION IntSchema.getMaskedEligibility(@reference varchar(7), @dob datetime)
        RETURNS TABLE
        AS
        RETURN
        (
          SELECT TOP(1)
            Eligibility.EligibilityId,
            Visitor.Title,
            Visitor.FirstName,
            Visitor.LastName,
            Visitor.HouseNumberAndStreet,
            Visitor.Town,
            Visitor.PostCode,
            Visitor.Benefit,
            Visitor.Relationship,
            Visitor.EmailAddress,
            Visitor.PhoneNumber,
            Prisoner.FirstName AS PrisonerFirstName,
            Prisoner.LastName AS PrisonerLastName,
            Prisoner.NameOfPrison,
            Prisoner.PrisonNumber
          FROM IntSchema.Eligibility AS Eligibility
            JOIN IntSchema.Visitor AS Visitor ON Visitor.EligibilityId = Eligibility.EligibilityId
            JOIN IntSchema.Prisoner AS Prisoner ON Prisoner.EligibilityId = Eligibility.EligibilityId
          WHERE
            Eligibility.Reference = @reference AND
            Visitor.DateOfBirth = @dob AND
            Eligibility.Status = 'APPROVED'
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
    .catch(function (error) {
      console.log(error)
      throw error
    })
}
