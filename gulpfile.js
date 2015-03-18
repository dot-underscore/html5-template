//config
var devUrl = "read.dev";

// Include gulp
var gulp = require('gulp'); 

// Include Our Plugins
var jshint      = require('gulp-jshint');
var sass        = require('gulp-sass');
var sourcemaps  = require('gulp-sourcemaps');
var minifycss   = require('gulp-minify-css');
var prefix      = require('gulp-autoprefixer');
var concat      = require('gulp-concat');
var uglify      = require('gulp-uglify');
var rename      = require('gulp-rename');
var browserSync = require('browser-sync');
var reload      = browserSync.reload;

// Lint Task
gulp.task('lint', function() {
    return gulp.src('js/*.js')
        .pipe(jshint())
        .pipe(jshint.reporter('default'));
});

// Compile Our Sass
gulp.task('sass', function() {
    return gulp.src('scss/*.scss')
        .pipe(sourcemaps.init())
        .pipe(sass())
        .pipe(prefix('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('css'))
        .pipe(rename({suffix: '.min'}))
        .pipe(minifycss())
        .pipe(gulp.dest('css'))
        .pipe(reload({stream: true}));
});

// Concatenate & Minify JS
gulp.task('scripts', function() {
    return gulp.src([
            './js/jquery-1.11.2.js', 
            './js/main.js' 
        ])
        // .pipe(sourcemaps.init())
        .pipe(concat('main.min.js'))
        .pipe(uglify())
        // .pipe(sourcemaps.write())
        .pipe(gulp.dest('js/min'))
        .pipe(reload({stream: true}));
});

// Watch Files For Changes
gulp.task('watch', function() {
    gulp.watch('js/*.js', ['scripts']);
    gulp.watch('scss/*.scss', ['sass']);
});

//Start browser sync server
gulp.task('browser-sync', function() {
    browserSync({
        proxy: devUrl
    });
});

// Default Task
gulp.task('default', ['sass', 'scripts', 'browser-sync', 'watch']);
gulp.task('lint', ['lint']);