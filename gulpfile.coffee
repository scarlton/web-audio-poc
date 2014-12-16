gulp = require('gulp')
coffee = require('gulp-coffee')
changed = require('gulp-changed')
concat = require('gulp-concat')
gutil = require('gulp-util')

SOURCE = './src/**/*.coffee'
DESTINATION = './app/js/'

gulp.task 'coffee', ->
  gulp.src(SOURCE)
    .pipe(changed(DESTINATION))
    .pipe(coffee(bare: true)
      .on('error', gutil.log))
    .pipe(concat('app.js'))
    .pipe(gulp.dest(DESTINATION))

gulp.task 'watch', ->
  gulp.watch(SOURCE, ['coffee'])

gulp.task('default', ['coffee'])