const gulp = require('gulp')
const sass = require('gulp-sass')
const spawn = require('child_process').spawn

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

gulp.task('generate-assets-and-start', gulp.series('sass', function () {
  spawn('node', ['app/bin/www'], { stdio: 'inherit' })
}))

gulp.task('default', gulp.series('generate-assets-and-start'))
