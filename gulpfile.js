'use strict';

var gulp = require('gulp'),
    gulpTaskLoader = require('gulp-task-loader')(), // load tasks from other files. Allows to write each gulp task into a separate file
    // gulpSequence = require('gulp-sequence'), // sequences, allows for sequential execution of tasks instead of parallel tasks
    watch = require('gulp-watch'); // watch plugin, also watches for new files and removed files


    // configure which files to watch and what tasks to use on file changes
    gulp.task('watch', function() {
      gulp.watch(['scripts/*.js'], ['js-compile']);
      gulp.watch(['stylesheets/*/*.scss','stylesheets/*.scss'], ['scss-compile']);
    });

gulp.task('default', ['watch']);
