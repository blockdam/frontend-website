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
<<<<<<< HEAD
            path.projectFolder + '/scripts/header.js'
=======
            path.projectFolder + '/scripts/detect.js',
            path.projectFolder + '/scripts/header.js',
            path.projectFolder + '/scripts/menu.js'
>>>>>>> 520bbbdde1a47787279b15241fc2535f63369e90
            ])
            .pipe(plumber())
            .pipe(concat('post.js'))
            .pipe(babel({
                presets: ['es2015']
            }))
            .pipe(gulp.dest(scriptsDir));

        var homepage = gulp.src([
<<<<<<< HEAD
            path.projectFolder + '/scripts/header.js'
=======
            path.projectFolder + '/scripts/detect.js',
            path.projectFolder + '/scripts/header.js',
            path.projectFolder + '/scripts/homepage.js',
            path.projectFolder + '/scripts/menu.js'
>>>>>>> 520bbbdde1a47787279b15241fc2535f63369e90
            ])
            // .pipe(plumber())
            .pipe(concat('homepage.js'))
            .pipe(babel({
                presets: ['es2015']
            }))
            .pipe(gulp.dest(scriptsDir));

        var page = gulp.src([
<<<<<<< HEAD
            path.projectFolder + '/scripts/header.js'
=======
            path.projectFolder + '/scripts/detect.js',
            path.projectFolder + '/scripts/header.js',
            path.projectFolder + '/scripts/menu.js'
>>>>>>> 520bbbdde1a47787279b15241fc2535f63369e90
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
