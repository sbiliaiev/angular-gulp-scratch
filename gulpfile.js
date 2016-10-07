var gulp        = require('gulp'),
    _p           = require('gulp-load-plugins')(),
    print       = require('gulp-print'),
    del         = require('del'),
    es          = require('event-stream'),
    Q           = require('q'),
    bowerFiles  = require('main-bower-files'),
    browserSync = require("browser-sync"),
    reload      = browserSync.reload;

var paths = {
    scripts: 'app/**/*.js',
    styles: ['./app/**/*.css', './app/**/*.scss'],
    images: './app/img/**/*',
    index: './app/index.html',
    partials: ['app/**/*.html', '!app/index.html'],
    distDev: './dist.dev',
    distProd: './dist.prod',
    distScriptsProd: './dist.prod/scripts',
    scriptsDevServer: 'devServer/**/*.js'
};

gulp.task('clean-dev', function() {
    return del('dist.dev');
});

gulp.task('build-index-dev', function() {
    var vendorScripts = function() {
        return gulp.src(bowerFiles())
            .pipe(gulp.dest('dist.dev/bower_components'))
            .pipe(_p.order(['jquery.js', 'bootstrap.js', 'angular.js']));
    };

    var appScripts = function() {
        return gulp.src('./app/**/*.js')
            .pipe(gulp.dest('dist.dev'))
            .pipe(_p.angularFilesort());
    };

    var vendorStyles = function() {
        return gulp.src(['bower_components/bootstrap/dist/css/bootstrap.css'])
            .pipe(gulp.dest('dist.dev/styles/'));
    };

    var appStyles = function() {
        return gulp.src(['app/**/*.css', './app/**/*.scss'])
            .pipe(_p.sass())
            .pipe(gulp.dest('dist.dev/'));
    };

    return gulp.src('./app/index.html')
        .pipe(gulp.dest('dist.dev'))
        .pipe(_p.inject(vendorScripts(), {relative: true, name: 'bower'}))
        .pipe(_p.inject(appScripts(), {relative: true}))
        .pipe(_p.inject(vendorStyles(), {relative: true, name: 'bower'}))
        .pipe(_p.inject(appStyles(), {relative: true}))
        .pipe(gulp.dest('./dist.dev'));
});

gulp.task('build-partials-dev', function() {
    return gulp.src(['app/**/*.html', '!app/index.html'])
        .pipe(gulp.dest('./dist.dev'));
});

gulp.task('build-images-dev', function() {
    return gulp.src('./app/img/**/*')
        .pipe(gulp.dest('./dist.dev/img'));
});

gulp.task('build-dev', gulp.series('clean-dev', gulp.parallel(
    'build-index-dev',
    'build-partials-dev',
    'build-images-dev'
)));
