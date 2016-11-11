var expect = require('chai').expect
var directoryCheck = require('../../../app/services/directory-check')
const config = require('../../../config')
var fs = require('fs')
var normalDocumentPath = `${config.FILE_UPLOAD_LOCATION}/1/1/1`
var claimExpensePath = `${config.FILE_UPLOAD_LOCATION}/1/1/1/1`

describe('services/directory-check', function () {
  it('check and see creates a directory is created for a doc without claimExpenseId', function () {
    directoryCheck('1', '1', undefined, '1')
    expect(fs.existsSync(normalDocumentPath)).to.equal(true)
    expect(fs.existsSync(claimExpensePath)).to.equal(false)
  })

  it('check and see creates a directory is created for a doc with claimExpenseId', function () {
    directoryCheck('1', '1', '1', '1')
    expect(fs.existsSync(claimExpensePath)).to.equal(true)
  })

  after(function () {
    if (fs.existsSync(claimExpensePath)) {
      fs.rmdirSync(claimExpensePath)
    }
    fs.rmdirSync(normalDocumentPath)
    fs.rmdirSync(`${config.FILE_UPLOAD_LOCATION}/1/1`)
    fs.rmdirSync(`${config.FILE_UPLOAD_LOCATION}/1`)
  })
})
