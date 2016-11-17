var gulp = require('gulp');
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var tsify = require('tsify');
var ts = require('gulp-typescript');
var tsProject = ts.createProject('tsconfig.json');
var watchify = require("watchify");
var gutil = require("gulp-util");

var watchedBrowserify = watchify( browserify({
    basedir: '.',
    debug: true,
    entries: [
        'src/p8client.ts',
        'src/objects/p8custom.ts',
        'src/objects/p8document.ts',
        'src/requests/p8download.ts',
        'src/requests/p8search.ts'
    ],
    cache: {},
    packageCache: {}
}).plugin(tsify) );

gulp.task('node-compile', function() {
    return tsProject.src().pipe( tsProject() ).js.pipe( gulp.dest('dist') );
});

function bundle() {
    return watchedBrowserify.bundle().pipe( source('p8client-bundle.js') ).pipe( gulp.dest('dist') );
}

gulp.task('default', ['node-compile'], bundle);
watchedBrowserify.on('update', bundle);
watchedBrowserify.on('log', gutil.log)