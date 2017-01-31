const prisonsEnum = require('../prisons-enum')
const enumHelper = require('./enum-helper')

module.exports.isNorthernIrelandPrison = function (value) {
  var prison = enumHelper.getKeyByAttribute(prisonsEnum, value)
  return prison && prison.region === 'NI'
}
