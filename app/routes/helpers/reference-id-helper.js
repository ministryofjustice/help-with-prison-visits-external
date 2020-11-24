const encrypt = require('../../../app/services/helpers/encrypt')
const decrypt = require('../../../app/services/helpers/decrypt')

module.exports.getReferenceId = function (reference, id) {
  const encrypted = encrypt(`${reference}-${id}`)
  return encrypted
}

module.exports.extractReferenceId = function (referenceId) {
  const decrypted = decrypt(referenceId)
  const split = decrypted.split('-')
  return { reference: split[0], id: split[1] }
}
