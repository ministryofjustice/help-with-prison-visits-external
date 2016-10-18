var expect = require('chai').expect
var referenceGenerator = require('../../../../app/services/reference-generator')
var proxyquire = require('proxyquire')
var sinon = require('sinon')
var config = require('../../../../knexfile').migrations
var knex = require('knex')(config)

var uniqueReference = '1234567'

var firstTimeClaim = proxyquire('../../../../app/services/data/first-time-claim', {
  '../reference-generator': referenceGenerator
})

describe('firstTimeClaim', function () {
  beforeEach(function () {
    if (referenceGenerator.generate.restore) referenceGenerator.generate.restore()
  })

  describe('getUniqueReference', function (done) {
    it('should call referenceGenerator', function (done) {
      var stubGenerate = sinon.stub(referenceGenerator, 'generate').returns(uniqueReference)

      var reference = firstTimeClaim.getUniqueReference()
      expect(reference).to.equal(uniqueReference)
      expect(stubGenerate.calledOnce).to.be.true
      done()
    })

    it('should check reference is not already in use', function (done) {
      // TODO
      done()
    })
  })

  describe('insertNewEligibilityAndPrisoner', function (done) {
    it('should insert a new Eligibility and Prisoner returning reference', function (done) {
      sinon.stub(referenceGenerator, 'generate').returns(uniqueReference)
      var prisonerData = {
        firstName: 'John',
        lastName: 'Smith',
        dateOfBirth: new Date(1980, 1, 1),
        prisonerNumber: 'A3456TB',
        NameOfPrison: 'Whitemoor'
      }

      firstTimeClaim.insertNewEligibilityAndPrisoner(prisonerData)
        .then(function (newReference) {
          expect(newReference).to.equal(uniqueReference)

          // Clean up
          knex('ExtSchema.Prisoner').where('Reference', uniqueReference).del().then(function () {
            knex('ExtSchema.Eligibility').where('Reference', uniqueReference).del().then(function () {
              done()
            })
          })
        })
        .catch(function (error) {
          throw error
        })
    })
  })
})
