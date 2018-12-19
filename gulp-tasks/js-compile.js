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
            path.projectFolder + '/scripts/_loadJSON.js',
            path.projectFolder + '/scripts/detect.js',
            path.projectFolder + '/scripts/metamask.js',
            path.projectFolder + '/scripts/header.js',
            path.projectFolder + '/scripts/menu.js',
            path.projectFolder + '/scripts/commenting.js',
            path.projectFolder + '/scripts/appreciation.js',
            path.projectFolder + '/scripts/donate.js'
            ])
            .pipe(plumber())
            .pipe(concat('post.js'))
            .pipe(babel({
                presets: ['es2015']
            }))
            .pipe(gulp.dest(scriptsDir));

        var homepage = gulp.src([
            path.projectFolder + '/scripts/_loadJSON.js',
            path.projectFolder + '/scripts/detect.js',
            path.projectFolder + '/scripts/metamask.js',
            path.projectFolder + '/scripts/charts.js',
            path.projectFolder + '/scripts/header.js',
            path.projectFolder + '/scripts/homepage.js',
            path.projectFolder + '/scripts/menu.js'

            ])
            // .pipe(plumber())
            .pipe(concat('homepage.js'))
            .pipe(babel({
                presets: ['es2015']
            }))
            .pipe(gulp.dest(scriptsDir));

        var page = gulp.src([
            path.projectFolder + '/scripts/_loadJSON.js',
            path.projectFolder + '/scripts/detect.js',
            path.projectFolder + '/scripts/metamask.js',
            path.projectFolder + '/scripts/header.js',
            path.projectFolder + '/scripts/menu.js',
            path.projectFolder + '/scripts/commenting.js',
            path.projectFolder + '/scripts/appreciation.js'

            ])
            // .pipe(plumber())
            .pipe(concat('page.js'))
            .pipe(babel({
                presets: ['es2015']
            }))
            .pipe(gulp.dest(scriptsDir));

        var members = gulp.src([
            path.projectFolder + '/scripts/_loadJSON.js',
            path.projectFolder + '/scripts/detect.js',
            path.projectFolder + '/scripts/metamask.js',
            path.projectFolder + '/scripts/header.js',
            path.projectFolder + '/scripts/members.js'
        ])
        // .pipe(plumber())
            .pipe(concat('members.js'))
            .pipe(babel({
                presets: ['es2015']
            }))
            .pipe(gulp.dest(scriptsDir));

        var transactions = gulp.src([
            path.projectFolder + '/scripts/_loadJSON.js',
            path.projectFolder + '/scripts/detect.js',
            path.projectFolder + '/scripts/metamask.js',
            path.projectFolder + '/scripts/header.js',
            path.projectFolder + '/scripts/transactions.js'
        ])
        // .pipe(plumber())
            .pipe(concat('transactions.js'))
            .pipe(babel({
                presets: ['es2015']
            }))
            .pipe(gulp.dest(scriptsDir));

        return merge(post, homepage, page, members, transactions);

    });
}
