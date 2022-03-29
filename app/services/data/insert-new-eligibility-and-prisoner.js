const { getDatabaseConnector } = require('../../databaseConnector')
const claimTypeEnum = require('../../constants/claim-type-enum')
const eligibilityStatusEnum = require('../../constants/eligibility-status-enum')
const referenceGenerator = require('../reference-generator')
const dateFormatter = require('../date-formatter')

module.exports = function (aboutThePrisoner, claimType, existingReference) {
  let reference
  if (claimType === claimTypeEnum.REPEAT_NEW_ELIGIBILITY && existingReference) {
    reference = existingReference
  } else {
    reference = referenceGenerator.generate()
  }

  const db = getDatabaseConnector()

  return db('Eligibility')
    .where('Reference', reference)
    .count('Reference as ReferenceCount')
    .then(function (countResult) {
      const count = countResult[0].ReferenceCount
      if (count > 0 && claimType !== claimTypeEnum.REPEAT_NEW_ELIGIBILITY) {
      // odds of two references in a row being non-unique 1x10e21
        reference = referenceGenerator.generate()
      }

      if (count > 0 && claimType === claimTypeEnum.REPEAT_NEW_ELIGIBILITY) {
        return updateExistingEligibilityAndPrisoner(aboutThePrisoner, reference)
      } else {
        return insertNewEligibiltyAndPrisoner(aboutThePrisoner, reference)
      }
    })
}

function insertNewEligibiltyAndPrisoner (aboutThePrisoner, uniqueReference) {
  let newEligibilityId
  const db = getDatabaseConnector()

  return db.insert({
    Reference: uniqueReference,
    DateCreated: dateFormatter.now().toDate(),
    Status: eligibilityStatusEnum.IN_PROGRESS
  })
    .into('Eligibility')
    .returning('EligibilityId')
    .then(function (insertedIds) {
      newEligibilityId = insertedIds[0].EligibilityId

      return db.insert({
        EligibilityId: newEligibilityId,
        Reference: uniqueReference,
        FirstName: aboutThePrisoner.firstName,
        LastName: aboutThePrisoner.lastName,
        DateOfBirth: aboutThePrisoner.dob,
        PrisonNumber: aboutThePrisoner.prisonerNumber,
        NameOfPrison: aboutThePrisoner.nameOfPrison
      })
        .into('Prisoner')
        .then(function () {
          return { reference: uniqueReference, eligibilityId: newEligibilityId }
        })
        .catch(function (error) {
          // Will leave orphaned Eligibility but will be cleaned up by worker
          throw error
        })
    })
}

function updateExistingEligibilityAndPrisoner (aboutThePrisoner, uniqueReference) {
  let newEligibilityId
  const db = getDatabaseConnector()

  return db('Eligibility')
    .where('Reference', uniqueReference)
    .update({
      Reference: uniqueReference,
      DateCreated: dateFormatter.now().toDate(),
      Status: eligibilityStatusEnum.IN_PROGRESS
    })
    .returning('EligibilityId')
    .then(function (updatedIds) {
      newEligibilityId = updatedIds[0].EligibilityId

      return db('Prisoner')
        .where('Reference', uniqueReference)
        .andWhere('EligibilityId', newEligibilityId)
        .update({
          FirstName: aboutThePrisoner.firstName,
          LastName: aboutThePrisoner.lastName,
          DateOfBirth: aboutThePrisoner.dob,
          PrisonNumber: aboutThePrisoner.prisonerNumber,
          NameOfPrison: aboutThePrisoner.nameOfPrison
        })
        .then(function () {
          return { reference: uniqueReference, eligibilityId: newEligibilityId }
        })
        .catch(function (error) {
          // Will leave orphaned Eligibility but will be cleaned up by worker
          throw error
        })
    })
}
