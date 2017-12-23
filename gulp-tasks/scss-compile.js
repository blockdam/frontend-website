'use strict';

/**
 * Compile stylesheets
 */

module.exports = function() {

let gulp = require('gulp'),
    sass = require('gulp-sass'),
    concat = require('gulp-concat'),
    postcss = require('gulp-postcss'),
    autoprefixer = require('autoprefixer'),
    cssnano = require('cssnano'),
    // file = require('gulp-file'),
    path = require('../local-path')();
    ;
    // rename = require('gulp-rename'),
    //


    var processors = [
        autoprefixer,
        cssnano
    ];

    return gulp.src([path.projectFolder + 'stylesheets/main.scss'])
        // .pipe(file('gees.css', '#hi {}', { src: true }))
       .pipe(sass().on('error', sass.logError))
       .pipe(postcss(processors))
        .pipe(gulp.dest(path.distFolder + 'assets/css/'));

};
