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

                path.projectFolder + '/scripts/waypoints.js',
                path.projectFolder + '/scripts/menu.js',
                path.projectFolder + '/scripts/commenting.js',
                path.projectFolder + '/scripts/appreciation.js'

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
                path.projectFolder + '/scripts/waypoints.js',
                path.projectFolder + '/scripts/homepage.js',
                path.projectFolder + '/scripts/menu.js',
                path.projectFolder + '/scripts/reading-list.js'
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
                path.projectFolder + '/scripts/waypoints.js',
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

        var activity = gulp.src([
            path.projectFolder + '/scripts/_loadJSON.js',
            path.projectFolder + '/scripts/detect.js',
            path.projectFolder + '/scripts/metamask.js',
            path.projectFolder + '/scripts/waypoints.js',
            path.projectFolder + '/scripts/menu.js',
            path.projectFolder + '/scripts/commenting.js',
            path.projectFolder + '/scripts/appreciation.js',
            path.projectFolder + '/scripts/rsvp.js'
        ])
        // .pipe(plumber())
            .pipe(concat('activity.js'))
            .pipe(babel({
                presets: ['es2015']
            }))
            .pipe(gulp.dest(scriptsDir));


        var dao = gulp.src([
                path.projectFolder + '/scripts/_loadJSON.js',
                path.projectFolder + '/scripts/detect.js',
                path.projectFolder + '/scripts/metamask.js',
                path.projectFolder + '/scripts/waypoints.js',
                path.projectFolder + '/scripts/dao.js'
            ])
        // .pipe(plumber())
            .pipe(concat('dao.js'))
            .pipe(babel({
                presets: ['es2015']
            }))
            .pipe(gulp.dest(scriptsDir));

        var token = gulp.src([
            path.projectFolder + '/scripts/_loadJSON.js',
            path.projectFolder + '/scripts/detect.js',
            path.projectFolder + '/scripts/metamask.js',
            path.projectFolder + '/scripts/waypoints.js',
            path.projectFolder + '/scripts/token.js'
        ])
        // .pipe(plumber())
            .pipe(concat('token.js'))
            .pipe(babel({
                presets: ['es2015']
            }))
            .pipe(gulp.dest(scriptsDir));

        var charts = gulp.src([

            path.projectFolder + '/scripts/charts/chart-init-objects.js',
            path.projectFolder + '/scripts/charts/chart-dimensions.js',
            path.projectFolder + '/scripts/charts/chart-svg.js',
            path.projectFolder + '/scripts/charts/chart-scales.js',
            path.projectFolder + '/scripts/charts/chart-axis.js',
            path.projectFolder + '/scripts/charts/chart-line.js',
            path.projectFolder + '/scripts/charts/chart-bar.js',
            path.projectFolder + '/scripts/charts/chart-area.js',
            path.projectFolder + '/scripts/charts/bcdSupply.js',
            path.projectFolder + '/scripts/charts/bcdCirculation.js',

        ])
            .pipe(concat('charts.js'))
            .pipe(babel({
                presets: ['es2015']
            }))
            .pipe(gulp.dest(scriptsDir));

        var webThree = gulp.src([

            path.projectFolder + '/scripts/web3/donate.js',
            path.projectFolder + '/scripts/web3/metamask.js'
        ])
            .pipe(concat('web3.js'))
            .pipe(babel({
                presets: ['es2015']
            }))
            .pipe(gulp.dest(scriptsDir));

        return merge(post, homepage, page, activity, dao, token, charts, webThree);

    });
}
