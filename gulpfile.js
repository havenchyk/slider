var gulp = require('gulp'),
	browserSync = require('browser-sync'),
	sass = require('gulp-sass'),
	plumber = require('gulp-plumber');

var onError = function (err) {  
  console.log(err);
};

gulp.task('browser-sync', function() {
    browserSync({
        server: {
            baseDir: "./"
        }
    });
});

gulp.task('js', function () {
    // return gulp.src('js/*js')
        // .pipe(browserify())
        // .pipe(gulp.dest('dist/js'));
});

gulp.task('sass', function () {
    gulp.src('./scss/*.scss')
	     .pipe(plumber({
	      errorHandler: onError
	    }))
        .pipe(sass())
        .pipe(gulp.dest('./css'))
        .pipe(browserSync.reload({stream:true}));
});

gulp.task('bs-reload', function () {
    browserSync.reload();
});

gulp.task('default', ['sass', 'browser-sync'], function () {
    gulp.watch("scss/*.scss", ['sass']);
    gulp.watch("js/*.js", ['js', browserSync.reload]);
    gulp.watch("*.html", ['bs-reload']);
});