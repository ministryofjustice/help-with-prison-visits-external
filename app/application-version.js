const fs = require('fs')
const config = require('../config')

const { buildNumber, gitRef, productId, branchName } = config
const { name: applicationName } = JSON.parse(fs.readFileSync('./package.json').toString())

module.exports = { applicationName, buildNumber, gitRef, gitShortHash: gitRef.substring(0, 7), productId, branchName }
