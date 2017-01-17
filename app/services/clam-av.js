const config = require('../../config')
const logger = require('./log')
var Promise = require('bluebird').Promise

var clam = require('clamscan')({
  remove_infected: config.CLAM_REMOVE_INFECTED,
  quarantine_infected: false,
  clamdscan: {
    path: config.CLAM_AV_PATH,
    config_file: config.CLAM_AV_CONF_PATH
  }
})

module.exports.scan = function (filePath) {
  return new Promise(function (resolve, reject) {
    if (config.ENABLE_MALWARE_SCANNING) {
      clam.is_infected(filePath, function (error, file, infected) {
        if (error) reject(error)

        if (infected) {
          logger.warn(`Malware detected in file ${file}`)
        }

        return resolve(infected)
      })
    } else {
      return resolve(false)
    }
  })
}
