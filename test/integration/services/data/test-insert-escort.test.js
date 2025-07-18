const { expect } = require('chai')
const insertEscort = require('../../../../app/services/data/insert-escort')
const eligiblityHelper = require('../../../helpers/data/eligibility-helper')
const claimEscortHelper = require('../../../helpers/data/claim-escort-helper')
const { getDatabaseConnector } = require('../../../../app/databaseConnector')

describe('services/data/insert-escort', () => {
  const REFERENCE = 'V123467'
  let eligibilityId
  let claimId

  before(() => {
    return eligiblityHelper.insertEligibilityClaim(REFERENCE).then(function (ids) {
      eligibilityId = ids.eligibilityId
      claimId = ids.claimId
    })
  })

  it('should insert a new escort', () => {
    return insertEscort(REFERENCE, eligibilityId, claimId, claimEscortHelper.build())
      .then(() => {
        return claimEscortHelper.get(claimId)
      })
      .then(escort => {
        expect(escort.EligibilityId).to.equal(eligibilityId)
        expect(escort.Reference).to.equal(REFERENCE)
        expect(escort.ClaimId).to.equal(claimId)
        expect(escort.FirstName).to.equal(claimEscortHelper.FIRST_NAME)
        expect(escort.LastName).to.equal(claimEscortHelper.LAST_NAME)
        expect(escort.DateOfBirth).to.be.within(
          claimEscortHelper.DOB.subtract(1, 'seconds').toDate(),
          claimEscortHelper.DOB.add(1, 'seconds').toDate(),
        )
      })
  })

  it('should mark previous inserted escorts as disabled', () => {
    const NEW_NAME = 'NEW'
    return insertEscort(REFERENCE, eligibilityId, claimId, claimEscortHelper.build())
      .then(() => {
        const newEscort = claimEscortHelper.build()
        newEscort.FirstName = NEW_NAME
        return insertEscort(REFERENCE, eligibilityId, claimId, newEscort)
      })
      .then(() => {
        const db = getDatabaseConnector()

        return db('ExtSchema.ClaimEscort').first().where({ ClaimId: claimId, IsEnabled: false })
      })
      .then(function (oldDisabledEscort) {
        expect(oldDisabledEscort.FirstName).to.equal(claimEscortHelper.FIRST_NAME)
      })
  })

  it('should throw an error if passed a non-AboutEscort object.', () => {
    return expect(() => {
      insertEscort(REFERENCE, eligibilityId, claimId, {})
    }).to.throw(Error)
  })

  after(() => {
    return eligiblityHelper.deleteAll(REFERENCE)
  })
})
