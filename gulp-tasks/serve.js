'use strict';

/**
 * Start a development webserver with live reload and serves the dist directory
 */

module.exports = function() {

    let gulp = require('gulp'),
        server = require('gulp-server-livereload');

    return gulp.src('dist')
        .pipe(server({
            livereload: true,
            port: 8000,
            directoryListing: false,
            open: true
        }));
};
