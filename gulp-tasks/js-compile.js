'use strict';

/**
 * Remove json data from the news queue
 */
module.exports = function() {

    let gulp = require('gulp'),
        babel = require('gulp-babel'),
        plumber = require('gulp-plumber'),
        concat = require('gulp-concat'),
        merge = require('merge-stream'),
        path = require('../local-path')();

    let scriptsDir = path.distFolder + '/assets/scripts/';

    gulp.task('js-compile', function() {

        var post = gulp.src([
            path.projectFolder + '/scripts/header.js'
            ])
            .pipe(plumber())
            .pipe(concat('post.js'))
            .pipe(babel({
                presets: ['es2015']
            }))
            .pipe(gulp.dest(scriptsDir));

        var homepage = gulp.src([
            path.projectFolder + '/scripts/header.js'
            ])
            // .pipe(plumber())
            .pipe(concat('homepage.js'))
            .pipe(babel({
                presets: ['es2015']
            }))
            .pipe(gulp.dest(scriptsDir));

        var page = gulp.src([
            path.projectFolder + '/scripts/header.js'
            ])
            // .pipe(plumber())
            .pipe(concat('page.js'))
            .pipe(babel({
                presets: ['es2015']
            }))
            .pipe(gulp.dest(scriptsDir));

        return merge(post, homepage, page);

    });
}
