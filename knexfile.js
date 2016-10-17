module.exports = {
  extweb: {
    client: 'mssql',
    connection: {
      host: process.env.APVS_DATABASE_SERVER,
      user: process.env.APVS_EXT_WEB_USERNAME,
      password: process.env.APVS_EXT_WEB_PASSWORD,
      database: process.env.APVS_DATABASE,
      options: {
        encrypt: true
      }
    },
    pool: {
      min: 2,
      max: 10
    }
  },

  migrations: {
    client: 'mssql',
    connection: {
      host: process.env.APVS_DATABASE_SERVER,
      user: process.env.APVS_EXT_MIGRATION_USERNAME,
      password: process.env.APVS_EXT_MIGRATION_PASSWORD,
      database: process.env.APVS_DATABASE,
      options: {
        encrypt: true
      }
    },
    migrations: {
      tableName: 'knex_ext_migrations'
    },
    debug: true
  }
}
