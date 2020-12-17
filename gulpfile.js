const gulp = require('gulp')
const sass = require('gulp-sass')
const spawn = require('child_process').spawn

gulp.task('assets', function (done) {
  gulp.src('node_modules/govuk_frontend_toolkit/javascripts/**/*')
    .pipe(gulp.dest('app/govuk_modules/govuk_frontend_toolkit/javascripts', { overwrite: true }))

  gulp.src('node_modules/govuk_frontend_toolkit/images/**/*')
    .pipe(gulp.dest('app/govuk_modules/govuk_frontend_toolkit/images', { overwrite: true }))

  gulp.src('node_modules/govuk_template_jinja/assets/**/*')
    .pipe(gulp.dest('app/govuk_modules/govuk_template/', { overwrite: true }))
  done()
})

gulp.task('templates', function (done) {
  gulp.src('node_modules/govuk_template_jinja/views/layouts/govuk_template.html')
    .pipe(gulp.dest('app/views/', { overwrite: true }))
  done()
})

gulp.task('sync', function (done) {
  gulp.src('app/assets/javascripts/**/*')
    .pipe(gulp.dest('app/public/javascripts/', { overwrite: true }))
  gulp.src('app/assets/images/**/*')
    .pipe(gulp.dest('app/public/images/', { overwrite: true }))
  done()
})

gulp.task('sass', function (done) {
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
  done()
})

gulp.task('generate-assets', gulp.series('assets', 'templates', 'sync', 'sass'))

gulp.task('generate-assets-and-start', gulp.series('generate-assets', function () {
  spawn('node', ['app/bin/www'], { stdio: 'inherit' })
}))

gulp.task('default', gulp.series('generate-assets-and-start'))
