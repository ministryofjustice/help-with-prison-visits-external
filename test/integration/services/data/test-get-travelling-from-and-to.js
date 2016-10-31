const expect = require('chai').expect
const config = require('../../../../knexfile').migrations
const knex = require('knex')(config)
const moment = require('moment')
const getTravellingFromAndTo = require('../../../../app/services/data/get-travelling-from-and-to')

describe('services/data/insert-bank-account-details-for-claim', function () {
  const REFERENCE = 'V123456'
  const TOWN = 'some town'
  const PRISON = 'some prison'
  const EXPECTED_RESULT = {
    from: TOWN,
    to: PRISON
  }

  before(function (done) {
    knex('ExtSchema.Eligibility')
      .insert({
        Reference: REFERENCE,
        DateCreated: moment().toDate(),
        Status: 'TEST'
      })
      .then(function () {
        return knex('ExtSchema.Visitor').insert({
          Reference: REFERENCE,
          Title: '',
          FirstName: '',
          LastName: '',
          NationalInsuranceNumber: '',
          HouseNumberAndStreet: '',
          Town: TOWN,
          County: '',
          PostCode: '',
          Country: '',
          EmailAddress: '',
          PhoneNumber: '',
          DateOfBirth: moment().toDate(),
          Relationship: '',
          JourneyAssistance: '',
          RequireBenefitUpload: false
        })
      })
      .then(function () {
        return knex('ExtSchema.Prisoner').insert({
          Reference: REFERENCE,
          NameOfPrison: PRISON,
          FirstName: '',
          LastName: '',
          DateOfBirth: '',
          PrisonNumber: ''
        })
      })
      .then(function () {
        done()
      })
      .catch(function (error) {
        console.log(error)
      })
  })

  it('should retrieve to and from information for the given reference', function (done) {
    getTravellingFromAndTo(REFERENCE)
      .then(function (result) {
        expect(result).to.deep.equal(EXPECTED_RESULT)
        done()
      })
  })

  after(function (done) {
    knex('ExtSchema.Prisoner').where('Reference', REFERENCE).del().then(function () {
      knex('ExtSchema.Visitor').where('Reference', REFERENCE).del().then(function () {
        knex('ExtSchema.Eligibility').where('Reference', REFERENCE).del().then(function () {
          done()
        })
      })
    })
  })
})
