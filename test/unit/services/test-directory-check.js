const expect = require('chai').expect
const proxyquire = require('proxyquire')
const sinon = require('sinon')
const config = require('../../../config')
const fs = require('fs')
const directoryCheck = require('../../../app/services/directory-check')

const BENEFIT_PATH = `${config.FILE_UPLOAD_LOCATION}/REFNUM1/hc2`
const VISIT_CONFIRMATION_PATH = `${config.FILE_UPLOAD_LOCATION}/REFNUM1/1234/VISIT_CONFIRMATION`
const CLAIM_EXPENSE_PATH = `${config.FILE_UPLOAD_LOCATION}/REFNUM1/1234/5678/RECEIPT`

describe('services/directory-check', function () {
  it('check and see creates a directory is created for a doc without claimExpenseId', function () {
    directoryCheck('REFNUM1', '1234', undefined, 'VISIT_CONFIRMATION')
    expect(fs.existsSync(VISIT_CONFIRMATION_PATH)).to.equal(true)
    expect(fs.existsSync(CLAIM_EXPENSE_PATH)).to.equal(false)
  })

  it('check and see creates a directory is created for a doc with claimExpenseId', function () {
    directoryCheck('REFNUM1', '1234', '5678', 'RECEIPT')
    expect(fs.existsSync(CLAIM_EXPENSE_PATH)).to.equal(true)
  })

  it('check and see creates a directory is created for a doc without claimId ie benefit documents', function () {
    directoryCheck('REFNUM1', null, undefined, 'hc2')
    expect(fs.existsSync(CLAIM_EXPENSE_PATH)).to.equal(true)
  })

  it('should not call the mkdirp.sync function if the file path does not exist', function () {
    var mkdirpStub = {
      sync: sinon.stub()
    }
    var directoryCheck = proxyquire('../../../app/services/directory-check', {
      'mkdirp': mkdirpStub
    })

    directoryCheck()
    sinon.assert.notCalled(mkdirpStub.sync)
  })

  after(function () {
    if (fs.existsSync(CLAIM_EXPENSE_PATH)) {
      fs.rmdirSync(CLAIM_EXPENSE_PATH)
      fs.rmdirSync(`${config.FILE_UPLOAD_LOCATION}/REFNUM1/1234/5678`)
    }
    if (fs.existsSync(VISIT_CONFIRMATION_PATH)) {
      fs.rmdirSync(VISIT_CONFIRMATION_PATH)
    }
    if (fs.existsSync(BENEFIT_PATH)) {
      fs.rmdirSync(BENEFIT_PATH)
    }

    if (fs.existsSync(`${config.FILE_UPLOAD_LOCATION}/REFNUM1/1234`)) {
      fs.rmdirSync(`${config.FILE_UPLOAD_LOCATION}/REFNUM1/1234`)
    }
    fs.rmdirSync(`${config.FILE_UPLOAD_LOCATION}/REFNUM1`)
  })
})
