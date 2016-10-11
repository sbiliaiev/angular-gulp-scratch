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
    // partials: './app/components/**/*.html,
    distDev: './dist.dev',
    distProd: './dist.prod',
    distScriptsProd: './dist.prod/js'
};


// === _PIPES_ ===
var pipes = {};

pipes.vendorScriptsDev = function() {
    return gulp.src(bowerFiles('**/*.js'))
        .pipe(gulp.dest('dist.dev/bower_components'))
        .pipe(_p.order(['jquery.js', 'bootstrap.js', 'angular.js']));
};

pipes.vendorScriptsProd = function() {
    return gulp.src(bowerFiles('**/*.js'))
        .pipe(_p.order(['jquery.js', 'bootstrap.js', 'angular.js']))
        .pipe(_p.concat('vendor.min.js'))
        .pipe(_p.uglify())
        .pipe(gulp.dest('dist.prod/js'));
};

pipes.appScriptsDev = function() {
    return gulp.src(path.scripts)
        .pipe(gulp.dest('dist.dev'))
        .pipe(_p.angularFilesort());
};

pipes.appScriptsProd = function() {
    return gulp.src(path.scripts)
        // .pipe(pipes.partialsProd())
        // .pipe(_p.angularFilesort())
        .pipe(_p.concat('app.min.js'))
        .pipe(_p.uglify())
        .pipe(gulp.dest('dist.prod/js'));
};

pipes.vendorStylesDev = function() {
    return gulp.src(path.vendor)
        .pipe(gulp.dest('dist.dev/styles/'));
};

pipes.vendorStylesProd = function() {
    return gulp.src(path.vendor)
        .pipe(_p.sass())
        .pipe(_p.concat('vendor.min.css'))
        .pipe(_p.minifyCss())
        .pipe(gulp.dest('dist.prod/css'));
};

pipes.appStylesDev = function() {
    return gulp.src(path.styles)
        .pipe(_p.sass())
        .pipe(gulp.dest('dist.dev/'));
};

pipes.appStylesProd = function() {
    return gulp.src(path.styles)
        .pipe(_p.sass())
        .pipe(_p.concat('style.min.css'))
        .pipe(_p.minifyCss())
        .pipe(gulp.dest('dist.prod/css'));
};

pipes.partialsDev = function() {
    return gulp.src(path.partials)
        .pipe(gulp.dest('./dist.dev'));
};

pipes.partialsProd = function() {
    return gulp.src(path.partials)
        .pipe(_p.htmlmin({collapseWhitespace: true, removeComments: true}))
        .pipe(_p.ngHtml2js({
            // base: "app",
            moduleName: "app",
            prefix: "./"
        }))
        .pipe(_p.concat('partials.min.js'))
        .pipe(_p.uglify())
        .pipe(gulp.dest('dist.prod/js'));
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

pipes.indexProd = function() {
    return gulp.src(path.index)
        .pipe(gulp.dest('./dist.prod'))
        .pipe(_p.inject(pipes.vendorScriptsProd(), {relative: true, name: 'bower'}))
        .pipe(_p.inject(pipes.partialsProd(), {relative: true, name: 'partials'}))
        .pipe(_p.inject(pipes.appScriptsProd(), {relative: true}))
        .pipe(_p.inject(pipes.vendorStylesProd(), {relative: true, name: 'bower'}))
        .pipe(_p.inject(pipes.appStylesProd(), {relative: true}))
        .pipe(_p.htmlmin({collapseWhitespace: true, removeComments: true}))
        .pipe(gulp.dest('./dist.prod'));
};

pipes.imagesDev = function() {
    return gulp.src(path.images)
        .pipe(gulp.dest('./dist.dev/img'));
};

pipes.imagesProd = function() {
    return gulp.src(path.images)
        .pipe(gulp.dest('./dist.prod/img'));
};

pipes.cleanDev = function() {
    return del('dist.dev');
};

pipes.cleanProd = function() {
    return del('dist.prod');
};

// === _TASKS_ ===
gulp.task('clean-dev', pipes.cleanDev);

gulp.task('clean-prod', pipes.cleanProd);

gulp.task('build-index-dev', pipes.indexDev);

gulp.task('build-vendor-scripts-prod', pipes.vendorScriptsProd);
gulp.task('build-app-scripts-prod', pipes.appScriptsProd);
gulp.task('build-vendor-styles-prod', pipes.vendorStylesProd);
gulp.task('build-app-styles-prod', pipes.appStylesProd);
gulp.task('build-index-prod', pipes.indexProd);

gulp.task('build-partials-dev', pipes.partialsDev);
gulp.task('build-partials-prod', pipes.partialsProd);

gulp.task('build-images-dev', pipes.imagesDev);
gulp.task('build-images-prod', pipes.imagesProd);

gulp.task('build-dev', gulp.series('clean-dev', gulp.parallel(
    'build-index-dev',
    'build-partials-dev',
    'build-images-dev'
)));

gulp.task('build-prod', gulp.series('clean-prod', gulp.parallel(
    'build-index-prod',
    'build-images-prod'
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

    //watch images
    _p.watch(path.images, function() {
        return pipes.imagesDev()
            .pipe(browserSync.reload({stream: true}));
    });
}));

gulp.task('watch-prod', gulp.series('build-prod', function() {

    //watch index
    _p.watch(path.index, function() {
        return pipes.indexProd()
        .pipe(browserSync.reload({stream: true}));
    });

    //wath app scripts
    _p.watch(path.scripts, function() {
        return pipes.appScriptsProd()
            .pipe(browserSync.reload({stream: true}));
    });

    //wath html partials
    _p.watch(path.partials, function() {
        return pipes.partialsProd()
            .pipe(browserSync.reload({stream: true}));
    });

    //watch styles
    _p.watch(path.styles, function() {
        return pipes.appStylesProd()
            .pipe(browserSync.reload({stream: true}));
    });

    //watch vendor scripts
    _p.watch(bowerFiles(), function() {
        return pipes.vendorScriptsProd()
            .pipe(browserSync.reload({stream: true}));
    });

    _p.watch(path.images, function() {
        return pipes.imagesProd()
            .pipe(browserSync.reload({stream: true}));
    });
}));

gulp.task('serve-dev', function() {
    browserSync.init({
        server: 'dist.dev'
    });

    // browserSync.watch('dist.dev/**/*.*').on('change', browserSync.reload);
});

gulp.task('serve-prod', function() {
    browserSync.init({
        server: 'dist.prod'
    });
});

gulp.task('dev',
    gulp.series('build-dev', gulp.parallel('watch-dev', 'serve-dev'))
);

gulp.task('prod',
    gulp.series('build-prod', gulp.parallel('watch-prod', 'serve-prod'))
);
