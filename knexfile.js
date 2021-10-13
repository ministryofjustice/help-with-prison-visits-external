const config = require('./config')

module.exports = {
  extweb: {
    client: 'mssql',
    connection: {
      host: config.DATABASE_SERVER,
      user: config.EXT_WEB_USERNAME,
      password: config.EXT_WEB_PASSWORD,
      database: config.DATABASE,
      options: {
        encrypt: false,
        enableArithAbort: true
      }
    },
    pool: {
      min: 2,
      max: 10
    }
  },
  testing: {
    client: 'mssql',
    connection: {
      host: config.TESTING_DATABASE_SERVER,
      user: config.TESTING_USERNAME,
      password: config.TESTING_PASSWORD,
      database: config.TESTING_DATABASE,
      options: {
        encrypt: false,
        enableArithAbort: true
      }
    }
  }
}
