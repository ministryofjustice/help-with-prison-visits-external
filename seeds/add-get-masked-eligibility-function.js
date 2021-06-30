const config = require('../config')

/**
 * Adds a table function to the IntSchema that retrieves eligibility data for a reference number and dob or
 * eligibilityId and grants the external web user permissions to call it.
 *
 * This information should be masked so the external web cannot query personal information.
 */
exports.seed = function (knex, Promise) {
  return knex.schema
    .raw('DROP FUNCTION IF EXISTS getMaskedEligibility')
    .then(function () {
      return knex.schema
        .raw(
          `
            CREATE FUNCTION getMaskedEligibility(@reference varchar(7), @dob datetime, @eligibiltyId int)
            RETURNS TABLE
            AS
            RETURN
            (
              SELECT TOP(1)
                Eligibility.EligibilityId,
                Visitor.FirstName,
                STUFF(Visitor.LastName, 2, 100, REPLICATE('*', LEN(Visitor.LastName) - 1)) AS LastName,
                STUFF(Visitor.HouseNumberAndStreet, 4, 100, REPLICATE('*', LEN(Visitor.HouseNumberAndStreet) -3)) AS HouseNumberAndStreet,
                Visitor.Town,
                REPLICATE('*', LEN(Visitor.PostCode) -3) + RIGHT(Visitor.PostCode, 3) AS PostCode,
                Visitor.Country,
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
              FROM Eligibility AS Eligibility
                JOIN Visitor AS Visitor ON Visitor.EligibilityId = Eligibility.EligibilityId
                JOIN Prisoner AS Prisoner ON Prisoner.EligibilityId = Eligibility.EligibilityId
              WHERE
                Eligibility.Reference = @reference AND
                (Visitor.DateOfBirth = @dob OR Eligibility.EligibilityId = @eligibiltyId)
              ORDER BY Eligibility.DateSubmitted DESC
            )
          `
        )
        .raw('GRANT SELECT ON getMaskedEligibility TO ??;', [config.EXT_WEB_USERNAME])
    })
    .catch(function (error) {
      console.log(error)
      throw error
    })
}
