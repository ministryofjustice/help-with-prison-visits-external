const config = require('../../config')
const Promise = require('bluebird').Promise
const NodeClam = require('clamscan')
const log = require('./log')

let clam
try {
  clam = new NodeClam().init({
    clamdscan: {
      host: config.CLAM_AV_HOST,
      port: config.CLAM_AV_PORT,
      timeout: config.CLAM_AV_TIMEOUT
    }
  })
} catch (error) {
  // Suppress clamscan error if disabled
  console.log(error)
  if (config.ENABLE_MALWARE_SCANNING !== 'true' &&
      !error.message.includes('No valid & active virus scanning binaries are active and available and no host/socket option provided!')) {
    throw error
  }
}

module.exports.scan = async function (filePath) {
  if (config.ENABLE_MALWARE_SCANNING === 'true') {
    return clam.then(async clamscan => {
      try {
        const { isInfected } = await clamscan.isInfected(filePath)
        return Promise.resolve(isInfected)
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
