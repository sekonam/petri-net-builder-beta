var gulp = require('gulp');
var browserify = require('browserify');
var babelify = require('babelify');
var source = require('vinyl-source-stream');
var less = require('gulp-less');
var concat = require('gulp-concat');

gulp.task('build-js', function () {
    return browserify({entries: './src/index.js', extensions: ['.js'], debug: true})
        .transform('babelify', {presets: ['es2015', 'react']})
        .bundle()
        .pipe(source('bundle.js'))
        .pipe(gulp.dest('dist'));
});

gulp.task('build-css', function () {
  gulp.src([
    './node_modules/bootstrap-less/index.less',
    './node_modules/react-bootstrap-switch/src/less/bootstrap3/react-bootstrap-switch.less',
    './node_modules/react-select/less/default.less',
    './style.css',
  ]).pipe(less())
    .pipe(concat('style.css'))
    .pipe(gulp.dest('./dist'));
});

gulp.task('default', ['build-js', 'build-css',]);
