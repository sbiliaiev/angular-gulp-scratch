var gulp        = require('gulp'),
    _p          = require('gulp-load-plugins')(),
    del         = require('del'),
    bowerFiles  = require('main-bower-files'),
    browserSync = require("browser-sync").create();

var path = {
    scripts: 'app/**/*.js',
    vendor: ['bower_components/bootstrap/dist/css/bootstrap.css'],
    styles: ['./app/**/*.css', './app/**/*.scss'],
    images: './app/img/**/*',
    index: './app/index.html',
    partials: ['app/**/*.html', '!app/index.html'],
    distDev: './dist.dev',
    distProd: './dist.prod',
    distScriptsProd: './dist.prod/scripts'
};


// === _PIPES_ ===
var pipes = {};

pipes.vendorScriptsDev = function() {
    return gulp.src(bowerFiles())
        .pipe(gulp.dest('dist.dev/bower_components'))
        .pipe(_p.order(['jquery.js', 'bootstrap.js', 'angular.js']));
};

pipes.appScriptsDev = function() {
    return gulp.src(path.scripts)
        .pipe(gulp.dest('dist.dev'))
        .pipe(_p.angularFilesort());
};

pipes.vendorStylesDev = function() {
    return gulp.src(path.vendor)
        .pipe(gulp.dest('dist.dev/styles/'));
};

pipes.appStylesDev = function() {
    return gulp.src(path.styles)
        .pipe(_p.sass())
        .pipe(gulp.dest('dist.dev/'));
};

pipes.indexDev = function() {
    return gulp.src(path.index)
        .pipe(gulp.dest('dist.dev'))
        .pipe(_p.inject(pipes.vendorScriptsDev(), {relative: true, name: 'bower'}))
        .pipe(_p.inject(pipes.appScriptsDev(), {relative: true}))
        .pipe(_p.inject(pipes.vendorStylesDev(), {relative: true, name: 'bower'}))
        .pipe(_p.inject(pipes.appStylesDev(), {relative: true}))
        .pipe(gulp.dest('./dist.dev'));
};

pipes.partialsDev = function() {
    return gulp.src(path.partials)
        .pipe(gulp.dest('./dist.dev'));
};

pipes.imagesDev = function() {
    return gulp.src(path.images)
        .pipe(gulp.dest('./dist.dev/img'));
};

pipes.cleanDev = function() {
    return del('dist.dev');
};


// === _TASKS_ ===
gulp.task('clean-dev', pipes.cleanDev);

gulp.task('build-index-dev', pipes.indexDev);

gulp.task('build-partials-dev', pipes.partialsDev);

gulp.task('build-images-dev', pipes.imagesDev);

gulp.task('build-dev', gulp.series('clean-dev', gulp.parallel(
    'build-index-dev',
    'build-partials-dev',
    'build-images-dev'
)));

gulp.task('watch-dev', gulp.series('build-dev', function() {

    //watch index
    _p.watch(path.index, function() {
        return pipes.indexDev()
        .pipe(browserSync.reload({stream: true}));
    });

    //wath app scripts
    _p.watch(path.scripts, function() {
        return pipes.appScriptsDev()
            .pipe(browserSync.reload({stream: true}));
    });

    //wath html partials
    _p.watch(path.partials, function() {
        return pipes.partialsDev()
            .pipe(browserSync.reload({stream: true}));
    });

    //watch styles
    _p.watch(path.styles, function() {
        return pipes.appStylesDev()
            .pipe(browserSync.reload({stream: true}));
    });

    //watch vendor scripts
    _p.watch(bowerFiles(), function() {
        return pipes.vendorScriptsDev()
            .pipe(browserSync.reload({stream: true}));
    });
}));

gulp.task('serve', function() {
    browserSync.init({
        server: 'dist.dev'
    });

    // browserSync.watch('dist.dev/**/*.*').on('change', browserSync.reload);
});

gulp.task('dev',
    gulp.series('build-dev', gulp.parallel('watch-dev', 'serve'))
);
