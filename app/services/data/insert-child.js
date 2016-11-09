const AboutChild = require('../domain/about-child')

// TODO: Add integration test for this module.
module.exports = function (claimId, aboutChild) {
  if (!(aboutChild instanceof AboutChild)) {
    throw new Error('Provided object is not an instance of the expected class')
  }

  // TODO: Implement persistance.
}
