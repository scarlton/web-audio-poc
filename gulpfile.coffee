gulp = require('gulp')
coffee = require('gulp-coffee')
changed = require('gulp-changed')
concat = require('gulp-concat')
less = require('gulp-less')
gutil = require('gulp-util')

COFFEE_SOURCE = './src/coffee/**/*.coffee'
COFFEE_DESTINATION = './app/js/'

LESS_SOURCE = './src/less/**/*.less'
LESS_DESTINATION = './app/css/'

gulp.task 'coffee', ->
  gulp.src(COFFEE_SOURCE)
    .pipe(changed(COFFEE_DESTINATION))
    .pipe(coffee(bare: true)
      .on('error', gutil.log))
    .pipe(concat('app.js'))
    .pipe(gulp.dest(COFFEE_DESTINATION))

gulp.task 'less', ->
  gulp.src(LESS_SOURCE)
    .pipe(changed(LESS_DESTINATION))
    .pipe(less()
      .on('error', gutil.log))
    .pipe(concat('app.css'))
    .pipe(gulp.dest(LESS_DESTINATION))

gulp.task 'watch', ->
  gulp.watch(COFFEE_SOURCE, ['coffee'])
  gulp.watch(LESS_SOURCE, ['less'])

gulp.task('default', ['coffee', 'less'])