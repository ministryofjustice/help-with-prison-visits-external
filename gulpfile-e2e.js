var gulp = require('gulp')
var selenium = require('selenium-standalone')
var webdriver = require('gulp-webdriver')

let seleniumServer

gulp.task('selenium', (done) => {
  selenium.install({logger: console.log}, () => {
    selenium.start((err, child) => {
      if (err) { return done(err) }
      seleniumServer = child
      done()
    })
  })
})

gulp.task('e2e', ['selenium'], () => {
  return gulp.src('test/wdio.conf.js')
    .pipe(webdriver()).on('error', () => {
      seleniumServer.kill()
      process.exit(1)
    })
    .once('error', function () { // Explicit exit for gulp-mocha
      seleniumServer.kill()
      process.exit(1)
    })
    .once('end', function () {
      seleniumServer.kill()
      process.exit()
    })
})

gulp.task('e2e-smoke', ['selenium'], () => {
  return gulp.src('test/wdio.conf.smoke.js')
    .pipe(webdriver()).on('error', () => {
      seleniumServer.kill()
      process.exit(1)
    })
    .once('error', function () { // Explicit exit for gulp-mocha
      seleniumServer.kill()
      process.exit(1)
    })
    .once('end', function () {
      seleniumServer.kill()
      process.exit()
    })
})

gulp.task('default', ['e2e'])
