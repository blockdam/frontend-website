'use strict';

const gulp = require('gulp');
const gulpTaskLoader = require('gulp-task-loader')('./gulp-tasks'); // load tasks from other files. Allows to write each gulp task into a separate file

let build = gulp.parallel('scss-compile');

gulp.task('default', build);