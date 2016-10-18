var assert = require('chai').assert
var expect = require('chai').expect
var referenceGenerator = require('../../../../app/services/reference-generator')
var proxyquire = require('proxyquire')
var sinon = require('sinon')

var firstTimeClaim = proxyquire('../../../../app/services/data/first-time-claim', {
  '../reference-generator': referenceGenerator
})

describe('firstTimeClaim', function () {
  beforeEach(function () {
    if (referenceGenerator.generate.restore) referenceGenerator.generate.restore()
  })

  describe('getUniqueReference', function (done) {
    it('should call referenceGenerator', function (done) {
      var uniqueReference = '1234567'
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
    it('should insert a new Eligibiltiy and Prisoner row as transaction', function (done) {
      var uniqueReference = '1234567'
      sinon.stub(referenceGenerator, 'generate').returns(uniqueReference)

      var prisonerData = {
        firstName: 'John',
        lastName: 'Smith',
        dateOfBirth: new Date(1980, 1, 1),
        prisonerNumber: 'A3456TB',
        NameOfPrison: 'Whitemoor'
      }

      firstTimeClaim.insertNewEligibilityAndPrisoner(prisonerData)
        .then(function (eligibilityPrisoner) {
          // expect(eligibilityPrisoner.reference).to.equal(uniqueReference)
          done()
        })
        .catch(function (error) {
          throw error
        })
    })
  })
})
