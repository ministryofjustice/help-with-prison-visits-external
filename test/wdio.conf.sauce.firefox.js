exports.config = {
  specs: ['./test/e2e/**/*.js'],
  exclude: [],
  maxInstances: 1,
  services: ['sauce'],
  user: process.env.SAUCE_USERNAME,
  key: process.env.SAUCE_ACCESS_KEY,
  baseUrl: process.env.SAUCE_BASEURL || 'http://localhost:3000',
  sauceConnect: true,
  capabilities: [{
    maxInstances: 1,
    browserName: 'firefox',
    platform: 'Windows 10',
    version: '49.0'
  }],
  sync: false,
  logLevel: 'verbose',
  coloredLogs: true,
  screenshotPath: './errorShots/',
  waitforTimeout: 10000,
  connectionRetryTimeout: 90000,
  connectionRetryCount: 3,
  framework: 'mocha',
  mochaOpts: {
    ui: 'bdd',
    timeout: 500000
  }
}
