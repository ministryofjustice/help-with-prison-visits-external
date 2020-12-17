module.exports = {
  // Basic auth (for public test environments)
  BASIC_AUTH_ENABLED: process.env.BASIC_AUTH_ENABLED || 'false',
  BASIC_AUTH_USERNAME: process.env.BASIC_AUTH_USERNAME,
  BASIC_AUTH_PASSWORD: process.env.BASIC_AUTH_PASSWORD,

  // Logging
  LOGGING_PATH: process.env.LOGGING_PATH,
  LOGGING_LEVEL: process.env.LOGGING_LEVEL || 'DEBUG',
  LOGSTASH_HOST: process.env.LOGSTASH_HOST,
  LOGSTASH_PORT: process.env.LOGSTASH_PORT,

  // Rate limiting
  RATE_LIMITING_ENABLED: process.env.RATE_LIMITING_ENABLED || 'true',
  RATE_LIMITING_WINDOW_MILLISECONDS: process.env.RATE_LIMITING_WINDOW_MILLISECONDS || '1000',
  RATE_LIMITING_REQUEST_LIMIT: process.env.RATE_LIMITING_REQUEST_LIMIT || '100',

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
  EXT_APPLICATION_SECRET: process.env.APVS_EXT_APPLICATION_SECRET, // NO DEFAULT FOR SECURITY REASONS, WILL FAIL IF NOT SET
  EXT_SECURE_COOKIE: process.env.APVS_EXT_SECURE_COOKIE || 'false',
  EXT_SESSION_COOKIE_MAXAGE: process.env.APVS_EXT_SESSION_COOKIE_MAXAGE || '1200000', // 20 min default

  // Common salt used for hashing reference ids (32 chars)
  EXT_REFERENCE_SALT: process.env.APVS_EXT_REFERENCE_SALT || 'c1e59a204dd1b24c7130817b834eec69',

  // CLAM Anti-Virus configuration
  ENABLE_MALWARE_SCANNING: process.env.APVS_ENABLE_MALWARE_SCANNING || 'false',
  CLAM_AV_PATH: process.env.APVS_CLAM_AV_PATH || '/usr/local/bin/clamdscan',
  CLAM_AV_CONF_PATH: process.env.APVS_CLAM_AV_CONF_PATH || '/usr/local/etc/clamav/clamd.conf',
  CLAM_REMOVE_INFECTED: process.env.APVS_CLAM_AV_REMOVE_INFECTED || 'true',
  UPLOAD_FILE_TMP_DIR: process.env.APVS_UPLOAD_FILE_TMP_DIR || '/tmp',
  MALWARE_NOTIFICATION_EMAIL_ADDRESS: process.env.APVS_MALWARE_NOTIFICATION_ADDRESS || 'donotsend@apvs.com',

  // Toggle for turning private beta setting on and off
  PRIVATE_BETA_TOGGLE: process.env.APVS_PRIVATE_BETA_TOGGLE || 'true',

  // Maximum cost for an individual expense
  MAX_COST: process.env.APVS_MAX_COST || '999999.99',

  // Maximum number of days before and after which a claim can be submitted
  MAX_DAYS_AFTER_RETROSPECTIVE_CLAIM: process.env.APVS_MAX_DAYS_AFTER_RETROSPECTIVE_CLAIM || '28',
  MAX_DAYS_BEFORE_ADVANCE_CLAIM: process.env.APVS_MAX_DAYS_AFTER_RETROSPECTIVE_CLAIM || '28',

  // Azure App Insights
  APP_INSIGHTS_INSTRUMENTATION_KEY: process.env.APVS_APP_INSIGHTS_INSTRUMENTATION_KEY
}
