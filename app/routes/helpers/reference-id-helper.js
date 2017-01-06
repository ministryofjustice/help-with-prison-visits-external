const encrypt = require('../../../app/services/helpers/encrypt')
const decrypt = require('../../../app/services/helpers/decrypt')

module.exports.getReferenceId = function (reference, id) {
  var encrypted = encrypt(`${reference}-${id}`)
  return encrypted
}

module.exports.extractReferenceId = function (referenceId) {
  var decrypted = decrypt(referenceId)
  var split = decrypted.split('-')
  return { reference: split[0], id: split[1] }
}
