const expect = require('chai').expect
const proxyquire = require('proxyquire')
const sinon = require('sinon')
const Promise = require('bluebird').Promise
const fs = Promise.promisifyAll(require('fs'))
const path = require('path')
const stubLogger = {
  info: sinon.spy(),
  error: sinon.spy()
}
const moveFile = proxyquire('../../../app/services/move-file', {
  './log': stubLogger
})

const TMP_FILE_PATH = './test/resources/test_malware.txt'
const TARGET_PATH = './uploads'
const INVALID_TARGET_PATH = './non-existent'
const TARGET_FILE = 'moved.txt'

describe('services/move-file on file upload', function () {
  it('should move the file from temp to target directory', function () {
    return moveFile(TMP_FILE_PATH, TARGET_PATH, TARGET_FILE).then(function (result) {
      expect(result.dest).to.equal('./uploads')
      expect(result.path).to.equal('uploads/moved.txt')
    })
  })

  it('should raise an I/O error if the file cannot be written', function () {
    return moveFile(TMP_FILE_PATH, INVALID_TARGET_PATH, TARGET_FILE).catch(function (error) {
      const expectedMessage = 'ENOENT: no such file or directory'
      expect(error.message.includes(expectedMessage), 'Error message should indicate no such file or directory').to.be.true  //eslint-disable-line
    })
  })

  after(function () {
    return fs.unlinkSync(path.join(TARGET_PATH, TARGET_FILE))
  })
})
