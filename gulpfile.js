//config
//set devUrl false when there isn't any proxy!
// var devUrl = false;
// var devUrl = "devsite.dev";

var devUrl = "template.dev";
var fontName = "fontname";
var jsFiles = [
            './assets/js/jquery-1.11.2.js', 
            './assets/js/main.js' 
        ]
var prefixString= ['last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'];


// Include gulp
var gulp = require('gulp'); 

// Include Our Plugins
var plumber     = require('gulp-plumber');
var jshint      = require('gulp-jshint');
var sass        = require('gulp-sass');
var sourcemaps  = require('gulp-sourcemaps');
var minifycss   = require('gulp-minify-css');
var prefix      = require('gulp-autoprefixer');
var concat      = require('gulp-concat');
var uglify      = require('gulp-uglify');
var rename      = require('gulp-rename');
var fontcustom  = require('gulp-fontcustom');
var notify      = require("gulp-notify");
var browserSync = require('browser-sync');
var reload      = browserSync.reload;

// Lint Task
gulp.task('lint', function() {
    return gulp.src('assets/js/main.js')
        .pipe(jshint())
        .pipe(jshint.reporter('default'));
});

// Compile Our Sass
gulp.task('sass', function() {
    return gulp.src('assets/scss/*.scss')
        .pipe(plumber({errorHandler: notify.onError("Error: <%= error.message %>")}))
        .pipe(sourcemaps.init())
        .pipe(sass())
        .pipe(prefix(prefixString))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('assets/css'))
        .pipe(reload({stream: true}))
});

// Concatenate & Minify JS
gulp.task('scripts', function() {
    return gulp.src(jsFiles)
        .pipe(plumber({errorHandler: notify.onError("Error: <%= error.message %>")}))
        .pipe(concat('main.min.js'))
        .pipe(gulp.dest('assets/js/min'))
        .pipe(reload({stream: true}));
});

// Create website font
gulp.task('font', function() {
    return gulp.src('assets/img/icons/*.svg')
        .pipe(plumber({errorHandler: notify.onError("Error: <%= error.message %>")}))
        .pipe(fontcustom({
          font_name: fontName,
          preprocessor_path: '../fonts/customfont',
          templates: ['scss', 'preview']
        }))
        .pipe(gulp.dest("assets/fonts/customfont"))
        .pipe(notify("Font regenerated!"))
});

// Watch Files For Changes
gulp.task('watch', function() {
    gulp.watch('assets/js/*.js', ['scripts']);
    gulp.watch('assets/scss/*.scss', ['sass']);
    gulp.watch('assets/img/icons/*.svg', ['font']);
    gulp.watch('index.*', reload);

});

//Start browser sync server
gulp.task('browser-sync', function() {
    if(devUrl === false){
        browserSync({
            server: {
                baseDir: "./"
            }
        }); 
    }else{
        browserSync({
            proxy: devUrl    
        });
    }
});


//       PRODUCTION SETTINGS       //

//Minify, uglify production ready
gulp.task('scriptsProduction', function(){
    return gulp.src(jsFiles)
        .pipe(plumber({errorHandler: notify.onError("Error: <%= error.message %>")}))    
        .pipe(concat('main.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest('assets/js/min'));
})
gulp.task('sassProduction', function(){
    return gulp.src('assets/scss/*.scss')
        .pipe(plumber({errorHandler: notify.onError("Error: <%= error.message %>")}))
        .pipe(sass())
        .pipe(prefix(prefixString))
        .pipe(minifycss())
        .pipe(gulp.dest('assets/css'));
})

// Default Task
gulp.task('default', ['sass', 'scripts', 'font', 'browser-sync', 'watch']);
gulp.task('production', ['sassProduction','scriptsProduction', 'font', 'lint']);