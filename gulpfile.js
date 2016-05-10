var path = require('path');
var gulp = require('gulp');
var eslint = require('gulp-eslint');
var excludeGitignore = require('gulp-exclude-gitignore');
var istanbul = require('gulp-istanbul');
var nsp = require('gulp-nsp');
var plumber = require('gulp-plumber');
var babel = require('gulp-babel');
var del = require('del');
var isparta = require('isparta');
var runSequence = require('run-sequence');
var sourcemaps = require('gulp-sourcemaps');
var concat = require('gulp-concat');
var compass = require('gulp-compass');
var mocha = require('gulp-mocha');

// Initialize the babel transpiler so ES2015 files gets compiled
// when they're loaded
require('babel-register')({
  extensions:['.js'],
  ignore: false,
});

var active = false;

gulp.task('nsp', function (cb) {
  nsp({package: path.resolve('package.json')}, cb);
});

gulp.task('pre-coverage', function () {
  return gulp.src(['src/**/*.js'])
    .pipe(istanbul({
      includeUntested: true,
    instrumenter: isparta.Instrumenter}))
    .pipe(istanbul.hookRequire())
})

gulp.task('coverage', ['pre-coverage'], function (cb) {
  var mochaErr
  gulp.src('./test/**/*-spec.js')
    .pipe(plumber())
    .pipe(mocha({
      reporter: 'spec'
    }))
    .on('error', function (err) {
      mochaErr = err
      console.log(JSON.stringify(err, null, 2).split('\\n').join('\n'))
    })
    .pipe(istanbul.writeReports())
    .on('end', function () {
      cb(mochaErr)
    })
})

gulp.task('test', function(cb) {
  var mochaErr;
  return gulp.src('./test/**/*-spec.js')
    .pipe(mocha())
    .on('error', function(err) {
      console.log(err.toString());
      this.emit('end')
    });
});

gulp.task('test__memorycache', function(cb) {
  var mochaErr;
  return gulp.src('./test/**/MemoryCache-spec.js')
    .pipe(mocha())
    .once('error', function(err) {
      mochaErr = err;
      // console.error(err);
      this.emit('end');
      process.exit(1);
    }).once('end', function () {
      process.exit();
    });
});

gulp.task('set-active', function() {
  active = true;
});

gulp.task('set-inactive', function() {
  active = false;
});

gulp.task('babel', function() {
  return gulp.src('src/**/*.js')
    .pipe(sourcemaps.init())
    .pipe(babel({
      presets: ['es2015']
    }))
    // .pipe(concat('all.js'))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('app'));
});

gulp.task('clean_app', function () {
  return del('app');
});

gulp.task('compass', function() {
  gulp.src('src/sass/*.scss')
    .pipe(compass({
      css: 'static/css',
      sass: 'src/sass',
      image:
      'app/static/images'
    }))
    .on('error', function() {});
});

gulp.task('static', function() {
  gulp.src(['static/**/*.*'])
    .pipe(gulp.dest('app/static'));
});

gulp.task('bower', function() {
    gulp.src('bower_components/**/*.*')
      .pipe(gulp.dest('app/static/vendor'));
});

gulp.task('watch__build', function () {
  gulp.watch(['src/**/*'], function() {
    if (active) return;
    runSequence('build');
  });
});

gulp.task('watch__test', function() {
  gulp.watch(['test/**/*-spec.js', 'src/**/*.js'], function() {
    if (active) return;
    runSequence('test');
  });
});

gulp.task('build', function () {
  runSequence('set-active', ['clean_app'], 'nsp', ['compass', 'babel'], ['static', 'bower'], 'set-inactive');
});

gulp.task('clean', ['clean_app']);

gulp.task('default', ['test']);
