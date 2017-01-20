const config = require('../../config')
var Promise = require('bluebird').Promise

var clam
try {
  clam = require('clamscan')({
    remove_infected: config.CLAM_REMOVE_INFECTED,
    quarantine_infected: false,
    clamdscan: {
      path: config.CLAM_AV_PATH,
      config_file: config.CLAM_AV_CONF_PATH
    }
  })
} catch (error) {
  // Suppress clamscan error if disabled
  if (config.ENABLE_MALWARE_SCANNING !== 'true' &&
      !error.message.includes('No valid & active virus scanning binaries are active and available!')) {
    throw error
  }
}

module.exports.scan = function (filePath) {
  return new Promise(function (resolve, reject) {
    if (config.ENABLE_MALWARE_SCANNING === 'true') {
      clam.is_infected(filePath, function (error, file, infected) {
        if (error) reject(error)
        return resolve(infected)
      })
    } else {
      return resolve(false)
    }
  })
}
