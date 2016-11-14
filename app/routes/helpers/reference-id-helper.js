module.exports.getReferenceId = function (reference, id) {
  return `${reference}-${id}`
}
module.exports.extractReferenceId = function (referenceId) {
  var split = referenceId.split('-')
  return { reference: split[0], id: split[1] }
}
