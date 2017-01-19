/* const expect = require('chai').expect
const clam = require('../../../app/services/clam-av')

// Include full path to test files for Clam AV Daemon when running locally
// Also, you will need to edit the contents of test_malware.txt to make the
// contents appear as a virus. Full instructions included in the file itself.
const MALWARE_FILE_PATH = '<INCLUDE FULL PATH>/test/resources/test_malware.txt'
const VALID_FILE_PATH = '<INCLUDE FULL PATH>/test/resources/testfile.txt'

describe('services/clam-av anti-virus check on file upload', function () {
  it('should detect a file with malicious content', function () {
    return clam.scan(MALWARE_FILE_PATH).then((infected) => {
      expect(infected).to.equal(true)
    })
  })

  it('should pass a file with no malicious content', function () {
    return clam.scan(VALID_FILE_PATH).then((infected) => {
      expect(infected).to.equal(false)
    })
  })
})
*/
