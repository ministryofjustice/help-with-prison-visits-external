const config = require('../../config')
const Promise = require('bluebird').Promise
const NodeClam = require('clamscan')
const log = require('./log')

let clam
try {
  clam = new NodeClam().init({
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
      !error.message.includes('No valid & active virus scanning binaries are active and available and no host/socket option provided!')) {
    throw error
  }
}

module.exports.scan = async function (filePath) {
  if (config.ENABLE_MALWARE_SCANNING === 'true') {
    clam.then(async clamscan => {
      try {
        const {is_infected, file, viruses} = await clamscan.is_infected(filePath) //eslint-disable-line
        return is_infected //eslint-disable-line
      } catch (err) {
        log.error('Error thrown during clamav scan')
        log.error(err)
        throw err
      }
    }).catch(err => {
      log.error('Error thrown during clamav initialisation')
      log.error(err)
      throw err
    })
  } else {
    return Promise.resolve(false)
  }
}
