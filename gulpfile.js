var gulp = require('gulp'),
    mocha = require('gulp-mocha'),
    sass = require('gulp-sass'),
    istanbul = require('gulp-istanbul');

gulp.task('mocha', function () {
    process.env.NODE_ENV = 'development';
    gulp.src(['./api/**/*.js', '!./api/**/*.spec.js', '!./api/index.js'])
        .pipe(istanbul()) // Covering files
        .pipe(istanbul.hookRequire()) // Force `require` to return covered files
        .on('finish', function () {
            gulp.src('./api/**/*.spec.js')
                .pipe(mocha({
                    ui: 'bdd',
                    reporter: 'spec'
                }))
                .pipe(istanbul.writeReports({
                    reporters: ['html', 'text', 'text-summary']
                }))
                .pipe(istanbul.enforceThresholds({
                    thresholds: {
                        global: 85
                    }
                }))
                .once('end', function () {
                    process.exit();
                });
        });
});

gulp.task('sass', function () {
    gulp.src('./sass/style.scss')
        .pipe(sass({
            outputStyle: 'compressed'
        }).on('error', sass.logError))
        .pipe(gulp.dest('./public/css/'));
});

gulp.task('watch', function () {
    gulp.watch(['./api/**/*.js', './sass/*'], ['sass']);
});

gulp.task('default', ['watch']);
gulp.task('test', ['mocha']);
