var gulp = require('gulp'),
    sass = require('gulp-sass'),
    //browserSync = require('browser-sync'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglifyjs'),
    cssnano = require('gulp-cssnano'),
    rename = require('gulp-rename'),
    del = require('del'),
    imagemin = require('gulp-imagemin'),
    pngquant = require('imagemin-pngquant'),
    cache = require('gulp-cache'),
    autoprefixer = require('gulp-autoprefixer');

//task for sass
gulp.task('sass', function() {
    return gulp.src('dev/sass/**/*.scss')
        .pipe(sass())
        .pipe(autoprefixer(['last 15 versions', '> 1%', 'ie 8', 'ie 7'], { cascade: true }))
        .pipe(gulp.dest('public/css'))
        .pipe(browserSync.reload({ stream: true }))
});

//task for css-libs
gulp.task('css-libs', async function() {
    return gulp.src('dev/sass/libs.sass')
        .pipe(sass())
        .pipe(cssnano())
        .pipe(rename({ suffix: '.min' }))
        .pipe(gulp.dest('dev/css'));
});

//task for browser-sync
/*
gulp.task('browser-sync', function() {
    browserSync({
        server: {
            baseDir: 'dev'
        },
        notify: false
    });
});
*/
//task for scripts
gulp.task('scripts', function() {
    return gulp.src([
            'dev/libs/jquery/dist/jquery.min.js',
            'dev/libs/magnific-popup/dist/jquery.magnific-popup.min.js'
        ])
        .pipe(concat(libs.min.js))
        .pipe(uglify())
        .pipe(gulp.dest('public/scripts'));
});


//clean dist
gulp.task('clean', function() {
    return del.sync('dist');
});


//images without cash
gulp.task('img', function() {
    return gulp.src('dev/img/**/*')
        .pipe(cache(imagemin({
            interlaced: true,
            progressive: true,
            svgoPlugins: [{ removeViewBox: false }],
            use: [pngquant()]
        })))
        .pipe(gulp.dest('public/img'));
});

//pre prod
gulp.task('build', async function() {

    var buildCss = gulp.src([
            'dev/css/main.css',
            'dev/css/libs.min.css'
        ])
        .pipe(gulp.dest('public/css'))

    var buildJs = gulp.src('dev/js//*')
        .pipe(gulp.dest('public/javascripts'))

});

//watch
gulp.task('watch', function() {
    gulp.watch('dev/sass/**/*.scss', gulp.parallel('sass'));
    gulp.watch(['dev/js/**/*.js', 'dev/libs/**/*.js'], gulp.parallel('scripts'));
});
gulp.task('default', gulp.parallel('css-libs', 'sass', 'scripts', /*'browser-sync',*/ 'watch'));
gulp.task('buid', gulp.parallel('clean', 'img', 'sass', 'scripts'));