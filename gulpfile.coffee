gulp = require('gulp')
coffee = require('gulp-coffee')
changed = require('gulp-changed')
concat = require('gulp-concat')
less = require('gulp-less')
sourcemaps = require('gulp-sourcemaps')
plumber = require('gulp-plumber')
notify = require('gulp-notify')

MODULE_SOURCE = './src/coffee/**/module.coffee'
COFFEE_SOURCE = './src/coffee/**/*.coffee'
COFFEE_DESTINATION = './app/js/'

LESS_SOURCE = './src/less/**/*.less'
LESS_DESTINATION = './app/css/'

onError = (err) ->
  notify.onError(
    title: 'Gulp'
    subtitle: 'Build failure'
    message: "Error: <%= error.message %>\nin <%= error.filename %> on line <%= error.location.first_line %>"
    sound: false
  )(err)

  @emit('end')


gulp.task 'coffee', ->
  gulp.src([MODULE_SOURCE, COFFEE_SOURCE])
    .pipe(sourcemaps.init())
      .pipe(plumber(errorHandler: onError))
      .pipe(changed(COFFEE_DESTINATION))
      .pipe(coffee(bare: true))
      .pipe(concat('app.js'))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(COFFEE_DESTINATION))

gulp.task 'less', ->
  gulp.src(LESS_SOURCE)
    .pipe(plumber(errorHandler: onError))
    .pipe(changed(LESS_DESTINATION))
    .pipe(less())
    .pipe(concat('app.css'))
    .pipe(gulp.dest(LESS_DESTINATION))

gulp.task 'watch', ->
  gulp.watch(COFFEE_SOURCE, ['coffee'])
  gulp.watch(LESS_SOURCE, ['less'])

gulp.task('default', ['coffee', 'less'])
