var gulp = require('gulp');
var mocha = require('gulp-mocha');
var sass = require('gulp-sass');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var templateCache = require('gulp-angular-templatecache');
var istanbul = require('gulp-istanbul');

gulp.task('mocha', function() {
  process.env.NODE_ENV = 'test';
  gulp.src(['./api/**/*.js', '!./api/**/*.spec.js', '!./api/index.js', '!./api/lib/**/*.js'])
    .pipe(istanbul()) // Covering files
    .pipe(istanbul.hookRequire()) // Force `require` to return covered files
    .on('finish', function() {
      gulp.src('./api/**/*.spec.js')
        .pipe(mocha({
          ui: 'bdd',
          reporter: 'spec'
        }))
        .pipe(istanbul.writeReports({
          reporters: ['html', 'text', 'text-summary', 'lcov']
        }))
        .pipe(istanbul.enforceThresholds({
          thresholds: {
            global: 80
          }
        }))
        .once('end', function() {
          process.exit();
        });
    });
});

gulp.task('templates', function() {
  return gulp.src('./app/js/**/*.html')
    .pipe(templateCache({module: 'Scholar', root: 'app'}))
    .pipe(gulp.dest('./app/js/tmp/'))
});

gulp.task('build-js', ['templates'], function() {
  return gulp.src(['./app/js/**/*.js'])
    .pipe(concat('bundle.js'))
    .pipe(uglify().on('error', console.log))
    .pipe(gulp.dest('./public/js/'));
});

gulp.task('build-css', ['sass'], function() {
  return gulp.src(['./app/tmp/**/*.css', './app/js/**/*.css'])
    .pipe(concat('bundle.css'))
    .pipe(gulp.dest('./public/css/'));
});

gulp.task('sass', function() {
  return gulp.src('./app/sass/style.scss')
    .pipe(sass({
      outputStyle: 'compressed'
    }).on('error', sass.logError))
    .pipe(gulp.dest('./app/tmp/'));
});

gulp.task('watch', ['build-css', 'build-js'], function() {
  gulp.watch(['./app/sass/**/*.scss'], ['build-css']);
  gulp.watch(['./app/js/**/*.js'], ['build-js']);
  gulp.watch(['./api/**/*.js'], ['mocha']);
});

gulp.task('default', ['watch']);
gulp.task('test', ['mocha']);
