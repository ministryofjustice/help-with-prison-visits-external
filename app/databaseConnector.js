require('dotenv').config()
const knex = require('knex')
const { KNEX_CONFIG } = require('../config')

let cachedConnection

function getDatabaseConnector (connectionDetails = KNEX_CONFIG) {
  const knexConfig = require('../knexfile')[connectionDetails]

  if (cachedConnection) {
    return cachedConnection
  }
  const connection = knex(knexConfig)
  cachedConnection = connection
  return connection
}

module.exports = {
  getDatabaseConnector
}
