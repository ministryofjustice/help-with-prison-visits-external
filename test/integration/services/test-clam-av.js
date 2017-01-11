/* const expect = require('chai').expect
const clam = require('../../../app/services/clam-av')

// Include full path to test files for Clam AV Daemon when running locally
const MALWARE_FILE_PATH = '<INCLUDE FULL PATH>/resources/test_malware.txt'
const VALID_FILE_PATH = '<INCLUDE FULL PATH>/resources/testfile.txt'

describe('services/clam-av anti-virus check on file upload', function () {
  it('should detect a file with malicious content', function (done) {
    clam.scan(MALWARE_FILE_PATH).then((infected) => {
      expect(infected).to.equal(true)
    })
    done()
  })

  it('should pass a file with no malicious content', function (done) {
    clam.scan(VALID_FILE_PATH).then((infected) => {
      expect(infected).to.equal(false)
    })
    done()
  })
})
*/
