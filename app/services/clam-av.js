const config = require('../../config')
const Promise = require('bluebird').Promise
const NodeClam = require('clamscan')
const log = require('./log')

module.exports.scan = async function (filePath) {
  if (config.ENABLE_MALWARE_SCANNING === 'true') {
    try {
      const clam = new NodeClam().init({
        clamdscan: {
          host: config.CLAM_AV_HOST,
          port: config.CLAM_AV_PORT,
          timeout: config.CLAM_AV_TIMEOUT
        }
      })
      clam.then(async clamscan => {
        try {
          const {isInfected, file, viruses} = await clamscan.isInfected(filePath) //eslint-disable-line
          log.info('clamav: File scanned')
          return isInfected //eslint-disable-line
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
    } catch (error) {
      // Suppress clamscan error if disabled
      log.error(error)
      if (config.ENABLE_MALWARE_SCANNING !== 'true' &&
          !error.message.includes('No valid & active virus scanning binaries are active and available and no host/socket option provided!')) {
        throw error
      }
    }
  } else {
    return Promise.resolve(false)
  }
}
