const moment = require('moment')

module.exports = function (date) {
  return moment.utc(date).format('dddd D MMMM YYYY')
}
