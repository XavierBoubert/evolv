'use strict';

var gulp = require('gulp'),
    uglify = require('gulp-uglifyjs'),
    insert = require('gulp-insert'),
    packagejson = require('./package.json'),
    header = '/*! Evolv (' + packagejson.version + '). (C) 2015 Xavier Boubert. MIT @license: en.wikipedia.org/wiki/MIT_License */\r\n',
    distPath = './dist',
    featuresFiles = [
      './features/evolv/evolv.js'
    ];

function _addHeader(contents) {
  if (contents.substr(0, 1) != '{') {
    contents = header + contents;
  }

  return contents;
}

gulp.task('default', ['build', 'watch']);

gulp.task('build', function() {

  gulp
    .src(featuresFiles)
    .pipe(insert.prepend(header))
    .pipe(gulp.dest(distPath))
    .pipe(uglify('evolv.min.js', {
      outSourceMap: true
    }))
    .pipe(insert.transform(_addHeader))
    .pipe(gulp.dest(distPath));
});

gulp.task('watch', function() {
  gulp.watch('./features/**/*.js', ['build']);
});
