var fs = require('fs');
var gulp = require('gulp');
var sass = require('gulp-sass');
var babel = require('gulp-babel');
var concat = require('gulp-concat');
var watch = require('gulp-watch');
var merge = require('gulp-merge');
var rename = require('gulp-rename');
var print = require('gulp-print');
var uglify = require('gulp-uglify');
var sourcemaps = require('gulp-sourcemaps');
var jf = require('jsonfile');

var bundlePath = "src/MusicLibBundle/Resources/public";
var webPath = "web/bundles/musiclib";
var obj = jf.readFileSync("./.bowerrc");
var bowerPath = obj.directory;

if (!fs.existsSync(webPath)){
    fs.mkdirSync(webPath);
}

// concatenate js
gulp.task('concatjs', function() {
	return gulp.src(bundlePath + '/**/*.js')
		.pipe(sourcemaps.init())
        .pipe(concat('app.js'))
        .pipe(uglify())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(webPath));
});

// concatenate css
gulp.task('concatcss', function() {
	return gulp.src([bundlePath + '/**/*.css', bundlePath + '/**/*.scss'])
        .pipe(sass())
        .pipe(concat("app.css"))
        .pipe(gulp.dest(webPath));
});

// compiling jsx templates
gulp.task('babel', function() {
	return gulp.src(bundlePath + '/**/*.jsx')
        .pipe(sass())
        .pipe(gulp.dest(webPath + '/components.js'));
});

// compiling external libs
gulp.task('extlib', function() {
	gulp.src([
		bowerPath + "/jquery/dist/jquery.min.js",
		bowerPath + "/bootstrap-sass/assets/javascripts/bootstrap.min.js"
	])
    .pipe(concat("extlib.js"))
    .pipe(gulp.dest(webPath));

    return gulp.start("fonts");
});

gulp.task('fonts', function() {
	return gulp.src([
        bowerPath + "/bootstrap-sass/assets/fonts/**",
		bundlePath + "/fonts/**",
	]).pipe(gulp.dest(webPath + '/fonts'));
});

gulp.task('default', [
    'concatcss',
    'babel',
    'extlib',
    'concatjs'
]);

gulp.task('watch', function() {
    gulp.watch(bundlePath + '/**/*.css', ['concatcss']);
	gulp.watch(bundlePath + '/**/*.scss', ['concatcss']);
	gulp.watch(bundlePath + '/**/*.jsx', ['babel']);
	gulp.watch(bundlePath + '/**/*.js', ['concatjs']);
});