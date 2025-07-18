const path = require('path')
const moveFile = require('../../../app/services/move-file')

const TMP_FILE_PATH = './test/resources/test_malware.txt'
const TARGET_PATH = 'uploads'
const INVALID_TARGET_PATH = 'non-existent'
const TARGET_FILE = 'moved.txt'

describe('services/move-file on file upload', () => {
  it('should move the file from temp to target directory', () => {
    return moveFile(TMP_FILE_PATH, TARGET_PATH, TARGET_FILE).then(result => {
      expect(result).to.equal(path.join(TARGET_PATH, TARGET_FILE))
    })
  })

  it('should raise an I/O error if the file cannot be written', () => {
    return moveFile(TMP_FILE_PATH, INVALID_TARGET_PATH, TARGET_FILE).catch(error => {
      const expectedMessage = 'ENOENT: no such file or directory'
      expect(error.message.includes(expectedMessage), 'Error message should indicate no such file or directory').to.be.true  //eslint-disable-line
    })
  })
})
