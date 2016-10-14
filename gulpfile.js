var gulp = require('gulp')
var selenium = require('selenium-standalone')
var webdriver = require('gulp-webdriver')
var sass = require('gulp-sass')
var spawn = require('child_process').spawn

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

gulp.task('assets', function () {
  gulp.src('node_modules/govuk_frontend_toolkit/javascripts/**/*')
    .pipe(gulp.dest('app/govuk_modules/govuk_frontend_toolkit/javascripts', { overwrite: true }))

  gulp.src('node_modules/govuk_frontend_toolkit/images/**/*')
    .pipe(gulp.dest('app/govuk_modules/govuk_frontend_toolkit/images', { overwrite: true }))

  gulp.src('node_modules/govuk_template_jinja/assets/**/*')
    .pipe(gulp.dest('app/govuk_modules/govuk_template/', { overwrite: true }))
})

gulp.task('templates', function () {
  gulp.src('node_modules/govuk_template_jinja/views/layouts/govuk_template.html')
    .pipe(gulp.dest('app/views/', { overwrite: true }))
})

gulp.task('sync', function () {
  gulp.src('app/assets/javascripts/**/*')
    .pipe(gulp.dest('app/public/javascripts/', { overwrite: true }))
})

gulp.task('sass', function () {
  gulp.src('app/assets/sass/**/*.scss')
    .pipe(sass({
      style: 'expanded',
      sourcemap: true,
      includePaths: [
        'node_modules/govuk-elements-sass/public/sass',
        'node_modules/govuk_frontend_toolkit/stylesheets',
        'govuk_modules/govuk_template/assets/stylesheets',
        'govuk_modules/govuk_frontend_toolkit/stylesheets',
        'govuk_modules/govuk-elements-sass/'
      ],
      outputStyle: 'expanded'
    }).on('error', sass.logError))
    .pipe(gulp.dest('app/public/stylesheets'))
})

gulp.task('generate-assets-and-start', [
  'assets',
  'templates',
  'sync',
  'sass'
], function () {
  spawn('node', ['app/bin/www'], { stdio: 'inherit' })
})
