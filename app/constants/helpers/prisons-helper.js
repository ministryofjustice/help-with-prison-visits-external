const prisonsEnum = require('../prisons-enum')
const enumHelper = require('./enum-helper')

module.exports.isNorthernIrelandPrison = function (value) {
  const prison = enumHelper.getKeyByAttribute(prisonsEnum, value)
  return prison && prison.region === 'NI'
}
