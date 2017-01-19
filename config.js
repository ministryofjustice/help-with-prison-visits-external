module.exports = {
  // Basic auth (for public test environments)
  BASIC_AUTH_ENABLED: process.env.BASIC_AUTH_ENABLED || 'false',
  BASIC_AUTH_USERNAME: process.env.BASIC_AUTH_USERNAME,
  BASIC_AUTH_PASSWORD: process.env.BASIC_AUTH_PASSWORD,

  LOGGING_PATH: process.env.LOGGING_PATH,
  LOGGING_LEVEL: process.env.LOGGING_LEVEL || 'DEBUG',
  LOGSTASH_HOST: process.env.LOGSTASH_HOST,
  LOGSTASH_PORT: process.env.LOGSTASH_PORT,

  // DB
  DATABASE_SERVER: process.env.APVS_DATABASE_SERVER,
  DATABASE: process.env.APVS_DATABASE,
  EXT_WEB_USERNAME: process.env.APVS_EXT_WEB_USERNAME,
  EXT_WEB_PASSWORD: process.env.APVS_EXT_WEB_PASSWORD,
  EXT_MIGRATION_USERNAME: process.env.APVS_EXT_MIGRATION_USERNAME,
  EXT_MIGRATION_PASSWORD: process.env.APVS_EXT_MIGRATION_PASSWORD,

  // i18n
  I18N_UPDATEFILES: process.env.I18N_UPDATEFILES,

  // File upload
  FILE_UPLOAD_LOCATION: process.env.FILE_UPLOAD_LOCATION || './uploads',
  FILE_UPLOAD_MAXSIZE: process.env.FILE_UPLOAD_MAXSIZE || '5242880', // 5MB in Bytes.

  // Session and Cookie security (defaults for development)
  EXT_APPLICATION_SECRET: process.env.APVS_EXT_APPLICATION_SECRET || 'secret',
  EXT_SECURE_COOKIE: process.env.APVS_EXT_SECURE_COOKIE || 'false',

  // Common salt used for hashing reference ids (32 chars)
  EXT_REFERENCE_SALT: process.env.APVS_EXT_REFERENCE_SALT || 'c1e59a204dd1b24c7130817b834eec69',

    // CLAM Anti-Virus configuration
  ENABLE_MALWARE_SCANNING: process.env.APVS_ENABLE_MALWARE_SCANNING || 'false',
  CLAM_AV_PATH: process.env.APVS_CLAM_AV_PATH || '/usr/local/bin/clamdscan',
  CLAM_AV_CONF_PATH: process.env.APVS_CLAM_AV_CONF_PATH || '/usr/local/etc/clamav/clamd.conf',
  CLAM_REMOVE_INFECTED: process.env.APVS_CLAM_AV_REMOVE_INFECTED || 'true',
  UPLOAD_FILE_TMP_DIR: process.env.APVS_UPLOAD_FILE_TMP_DIR || '/tmp',
  MALWARE_NOTIFICATION_EMAIL_ADDRESS: process.env.APVS_MALWARE_NOTIFICATION_ADDRESS || 'donotsend@apvs.com'
}
