const fs = require('fs')

const packageData = JSON.parse(fs.readFileSync('./package.json'))
const buildNumber = packageData.version
module.exports = { buildNumber, packageData }
