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
        encrypt: true,
        enableArithAbort: true
      }
    },
    pool: {
      min: 2,
      max: 10
    }
  }
}
