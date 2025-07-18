const moment = require('moment')

module.exports = date => {
  return moment.utc(date).format('dddd D MMMM YYYY')
}
