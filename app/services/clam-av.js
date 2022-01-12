const config = require('../../config')
const Promise = require('bluebird').Promise
const NodeClam = require('clamscan')
const log = require('./log')

module.exports.scan = async function (filePath) {
  if (config.ENABLE_MALWARE_SCANNING === 'true') {
    try {
      const clamscan = await new NodeClam().init({
        clamdscan: {
          host: config.CLAM_AV_HOST,
          port: config.CLAM_AV_PORT,
          timeout: config.CLAM_AV_TIMEOUT
        }
      })

      log.info(`ClamAV initialised. Scanning ${filePath}`)
      const { isInfected } = await clamscan.isInfected(filePath)

      if (isInfected === null) throw new Error('ClamAV: Unable to scan')

      return Promise.resolve(isInfected)
    } catch (err) {
      log.error(err)
      throw new Error("Your file couldn't be uploaded. Please try again later.")
    }
  } else {
    log.info(`Malware scanning disabled - not scanning: ${filePath}`)
    return Promise.resolve(false)
  }
}
