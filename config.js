module.exports = {
  // Logging
  LOGGING_PATH: process.env.LOGGING_PATH,
  LOGGING_LEVEL: process.env.LOGGING_LEVEL || 'DEBUG',
  LOGSTASH_HOST: process.env.LOGSTASH_HOST,
  LOGSTASH_PORT: process.env.LOGSTASH_PORT,

  // ZenDesk
  ZENDESK_ENABLED: process.env.APVS_ZENDESK_ENABLED || 'false',
  ZENDESK_TEST_ENVIRONMENT: process.env.APVS_ZENDESK_TEST_ENVIRONMENT || 'true',
  ZENDESK_API_URL: process.env.APVS_ZENDESK_API_URL,
  ZENDESK_API_KEY: process.env.APVS_ZENDESK_API_KEY,
  ZENDESK_EMAIL_ADDRESS: process.env.APVS_ZENDESK_EMAIL_ADDRESS,

  // Rate limiting
  RATE_LIMITING_ENABLED: process.env.RATE_LIMITING_ENABLED || 'true',
  RATE_LIMITING_WINDOW_MILLISECONDS: process.env.RATE_LIMITING_WINDOW_MILLISECONDS || '1000',
  RATE_LIMITING_REQUEST_LIMIT: process.env.RATE_LIMITING_REQUEST_LIMIT || '100',

  // DB
  DATABASE_SERVER: process.env.APVS_DATABASE_SERVER,
  DATABASE: process.env.APVS_DATABASE,
  EXT_WEB_USERNAME: process.env.APVS_EXT_WEB_USERNAME,
  EXT_WEB_PASSWORD: process.env.APVS_EXT_WEB_PASSWORD,

  // i18n
  I18N_UPDATEFILES: process.env.I18N_UPDATEFILES,

  // File upload
  FILE_UPLOAD_MAXSIZE: process.env.FILE_UPLOAD_MAXSIZE || '5242880', // 5MB in Bytes.

  // S3
  AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID,
  AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY,
  AWS_S3_BUCKET_NAME: process.env.AWS_S3_BUCKET_NAME,

  // Session and Cookie security (defaults for development)
  EXT_APPLICATION_SECRET: process.env.APVS_EXT_APPLICATION_SECRET, // NO DEFAULT FOR SECURITY REASONS, WILL FAIL IF NOT SET
  EXT_SECURE_COOKIE: process.env.APVS_EXT_SECURE_COOKIE || 'false',
  EXT_SESSION_COOKIE_MAXAGE: process.env.APVS_EXT_SESSION_COOKIE_MAXAGE || '1200000', // 20 min default

  // Common salt used for hashing reference ids (32 chars)
  EXT_REFERENCE_SALT: process.env.APVS_EXT_REFERENCE_SALT || 'c1e59a204dd1b24c7130817b834eec69',

  // CLAM Anti-Virus configuration
  ENABLE_MALWARE_SCANNING: process.env.APVS_ENABLE_MALWARE_SCANNING || 'false',
  CLAM_AV_HOST: process.env.APVS_CLAM_AV_HOST || 'clamav',
  CLAM_AV_PORT: process.env.APVS_CLAM_AV_PORT || '3310',
  CLAM_AV_TIMEOUT: process.env.APVS_CLAM_AV_TIMEOUT || 60000,
  FILE_TMP_DIR: process.env.APVS_FILE_TMP_DIR || '/app/tmp',
  MALWARE_NOTIFICATION_EMAIL_ADDRESS: process.env.APVS_MALWARE_NOTIFICATION_ADDRESS || 'donotsend@apvs.com',

  // Maximum cost for an individual expense
  MAX_COST: process.env.APVS_MAX_COST || '999999.99',

  // Maximum number of days before and after which a claim can be submitted
  MAX_DAYS_AFTER_RETROSPECTIVE_CLAIM: process.env.APVS_MAX_DAYS_AFTER_RETROSPECTIVE_CLAIM || '28',
  MAX_DAYS_BEFORE_ADVANCE_CLAIM: process.env.APVS_MAX_DAYS_AFTER_RETROSPECTIVE_CLAIM || '28'
}
