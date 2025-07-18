const encrypt = require('../../services/helpers/encrypt')
const decrypt = require('../../services/helpers/decrypt')

module.exports.getReferenceId = (reference, id) => {
  const encrypted = encrypt(`${reference}-${id}`)
  return encrypted
}

module.exports.extractReferenceId = referenceId => {
  const decrypted = decrypt(referenceId)
  const split = decrypted.split('-')
  return { reference: split[0], id: split[1] }
}
