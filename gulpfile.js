var gulp = require('gulp')
  , jshint = require('gulp-jshint')
  , stylish = require('jshint-stylish')
  , bower = require('main-bower-files')
  , mocha = require('gulp-mocha')
  , mochaPhantomJS = require('gulp-mocha-phantomjs')
  , connect = require('gulp-connect')
  , typescript = require('gulp-tsc')
  , rimraf = require('gulp-rimraf')
  , rename = require('gulp-rename')
  , browserify = require('gulp-browserify');
  ;

gulp.task('lint', function() {
  return gulp.src(['index.js', './test/test.js'])
    .pipe(jshint())
    .pipe(jshint.reporter(stylish));
});

gulp.task('bower', function() {
  return gulp.src(bower())
    .pipe(gulp.dest('test'));
});

gulp.task('mocha', function() {
  return gulp.src('./test/*.js')
    .pipe(mocha({ reporter: 'spec' }));
});

gulp.task('mocha-phantomjs', function () {
  return gulp
    .src('test/index.html')
    .pipe(mochaPhantomJS());
});

gulp.task('server', function() {
  return connect.server({
    port: 3000
  });
});

gulp.task('compile', function () {
  return gulp.src(['logstorage.ts'])
    .pipe(typescript({
      noImplicitAny: true,
      declaration: true,
      module: 'commonjs'
    }))
    .pipe(gulp.dest('.'));
});

gulp.task('build', ['compile'], function() {
  return gulp.src('logstorage.js')
    .pipe(browserify({
      standalone: 'LogStorage'
    }))
    .pipe(rename('logstorage.js'))
    .pipe(gulp.dest('.'));
});

gulp.task('clean', function () {
  return gulp.src('logstorage.js', { read: false })
    .pipe(rimraf({ force: true }));
});
