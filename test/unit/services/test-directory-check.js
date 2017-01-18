var expect = require('chai').expect
var directoryCheck = require('../../../app/services/directory-check')
const config = require('../../../config')
var fs = require('fs')
var benefitPath = `${config.FILE_UPLOAD_LOCATION}/REFNUM1/hc2`
var visitConfirmationPath = `${config.FILE_UPLOAD_LOCATION}/REFNUM1/1234/VISIT_CONFIRMATION`
var claimExpensePath = `${config.FILE_UPLOAD_LOCATION}/REFNUM1/1234/5678/RECEIPT`

describe('services/directory-check', function () {
  it('check and see creates a directory is created for a doc without claimExpenseId', function () {
    directoryCheck('REFNUM1', '1234', undefined, 'VISIT_CONFIRMATION')
    expect(fs.existsSync(visitConfirmationPath)).to.equal(true)
    expect(fs.existsSync(claimExpensePath)).to.equal(false)
  })

  it('check and see creates a directory is created for a doc with claimExpenseId', function () {
    directoryCheck('REFNUM1', '1234', '5678', 'RECEIPT')
    expect(fs.existsSync(claimExpensePath)).to.equal(true)
  })

  it('check and see creates a directory is created for a doc without claimId ie benefit documents', function () {
    directoryCheck('REFNUM1', null, undefined, 'hc2')
    expect(fs.existsSync(claimExpensePath)).to.equal(true)
  })

  after(function () {
    if (fs.existsSync(claimExpensePath)) {
      fs.rmdirSync(claimExpensePath)
      fs.rmdirSync(`${config.FILE_UPLOAD_LOCATION}/REFNUM1/1234/5678`)
    }
    if (fs.existsSync(visitConfirmationPath)) {
      fs.rmdirSync(visitConfirmationPath)
    }
    if (fs.existsSync(benefitPath)) {
      fs.rmdirSync(benefitPath)
    }

    if (fs.existsSync(`${config.FILE_UPLOAD_LOCATION}/REFNUM1/1234`)) {
      fs.rmdirSync(`${config.FILE_UPLOAD_LOCATION}/REFNUM1/1234`)
    }
    fs.rmdirSync(`${config.FILE_UPLOAD_LOCATION}/REFNUM1`)
  })
})
