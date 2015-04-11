'use strict';

var gulp = require('gulp');
var browserify = require('gulp-browserify');
var sass = require('gulp-sass');
var csso = require('gulp-csso');
var livereload = require('gulp-livereload');
var tinylr = require('tiny-lr');
var server = tinylr();
var jade = require('gulp-jade');
var path = require('path');
var express = require('express');
var app = express();
var gutil = require('gulp-util');
var gulpif = require('gulp-if');
var uglify = require('gulp-uglify');
var s3 = require('gulp-s3');
var gzip = require('gulp-gzip');
var colors = require('colors');
var rename = require('gulp-rename');
var _ = require('lodash');


var PRODUCTION_MODE = gutil.env.production;
var projectName = require('./package').name;


gulp.task('js-lib', function() {
    return gulp.src('src/js/lib/**/*.js')
            .pipe(gulpif(PRODUCTION_MODE, uglify()))
            .pipe(gulp.dest('./public/js/lib/'))
            .pipe( livereload( server ));
});

gulp.task('gzip', ['build'], function() {
    return gulp.src('public/**/*.{js,css}')
                .pipe(gzip())
                .pipe(rename(function(path) {
                    path.extname = '';
                }))
                .pipe(gulp.dest('./public/'));
});

gulp.task('browserify', function() {
    // Single entry point to browserify
    return gulp.src('src/js/app.js')
        .pipe(browserify({
            debug : !PRODUCTION_MODE
        }))
        .on('error', gutil.log)
        .on('error', gutil.beep)
        .pipe(gulpif(PRODUCTION_MODE, uglify()))
        .pipe(gulp.dest('./public/js/'))
        .pipe( livereload( server ));
});


gulp.task('css', function() {
    return gulp
            .src('src/stylesheets/app.scss')
            .pipe(
                sass({
                    includePaths: ['src/stylesheets'],
                    errLogToConsole: true
                }))
            .pipe( gulpif(PRODUCTION_MODE, csso()) )
            .pipe( gulp.dest('./public/css/') )
            .pipe( livereload( server ));
});


gulp.task('fonts', function() {
    return gulp
            .src('src/fonts/**/*.{otf,svg,ttf,woff,eot}')
            .pipe( gulp.dest('./public/fonts/') )
            .pipe( livereload( server ));
});

gulp.task('images', function() {
    return gulp
            .src('src/images/**/*')
            .pipe( gulp.dest('./public/images/') )
            .pipe( livereload( server ));
});

gulp.task('jade', function() {

    delete require.cache[require.resolve('./src/js/utils')];
    var utils = require('./src/js/utils');

    
    var host = '/' + projectName + '/';

    if(!PRODUCTION_MODE) {
        host = '/';
    }
    
    return gulp.src('src/templates/index.jade')
               .pipe(jade({
                    pretty: !PRODUCTION_MODE,
                    locals: {
                        utils: utils,
                        STATIC_URL: host,
                        _: _
                    }
               }))
               .on('error', gutil.log)
               .on('error', gutil.beep)
               .pipe(gulp.dest('./public/'))
               .pipe( livereload( server ));
});

gulp.task('templates', ['static'], function() {
    return gulp.start('jade');
});


gulp.task('express', function() {
    app.use(express.static(path.resolve('./public')));
    app.listen(8000);
    gutil.log('Listening on port: 8000');
});
 
gulp.task('watch', function () {
  server.listen(35729, function (err) {
    if (err) {
      return console.log(err);
    }
 
    gulp.watch('src/stylesheets/**/*.{scss,css}',['css', 'jade']);
    gulp.watch('src/js/**/*.js',['js']);
    gulp.watch('src/templates/**/*.jade',['jade', 'js']);
  });
});


gulp.task('gzip', ['build'], function() {
    return gulp.src('public/**/*.{js,css}')
                .pipe(gzip())
                .pipe(rename(function(path) {
                    path.extname = '';
                }))
                .pipe(gulp.dest('./public/'));
});

gulp.task('deploy', ['gzip'], function() {
    var aws;
    try {
        aws = {
              'key': process.env.AWS_KEY,
              'secret': process.env.AWS_SECRET,
              'bucket': process.env.AWS_BUCKET
        };

        if(!aws.key || !aws.secret || !aws.bucket) {
            new Error('Problem with aws keys');
        }
    } catch(err) {
        gutil.log('Could not parse aws keys. Aborting deployment.'.red);
        return;
    }

    gulp.src(['./public/**', '!./public/**/*.{js,css,gz}'], { read: false })
        .pipe(s3(aws, {
            uploadPath: projectName + '/',
            headers: {
                'Cache-Control': 'max-age=300, no-transform, public'
            }
        }));
    gulp.src('./public/**/*.{js,css,gz}', { read: false })
        .pipe(s3(aws, {
            uploadPath: projectName + '/',
            headers: {
                'Cache-Control': 'max-age=300, no-transform, public',
                'Content-Encoding': 'gzip'
            }
        }));

});


gulp.task('js', ['browserify','js-lib']);
gulp.task('static', ['js', 'css', 'fonts', 'images']);
gulp.task('default', ['templates','express','watch']);
gulp.task('build', ['templates']);
