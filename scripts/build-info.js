/* eslint-disable consistent-return */

const fs = require('fs')
const { dirname } = require('path')
const { mkdirp } = require('mkdirp')

function writeFile (path, contents, callback) {
  mkdirp(dirname(path), err => {
    if (err) return callback(err)

    fs.writeFile(path, contents, callback)
  })
}

module.exports.recordBuildInfoTo = (target, contents, callback) => {
  writeFile(target, JSON.stringify(contents, null, 2), callback)
}
